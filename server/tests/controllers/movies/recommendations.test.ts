import * as moxios from 'moxios';
import * as config from 'config';
import * as bcrypt from 'bcrypt';
import { agent, Response, SuperTest, Test } from 'supertest';
import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import app from '../../../src/app';
import { Movie } from '../../../src/entities/Movie';
import { Genre } from '../../../src/entities/Genre';
import { User } from '../../../src/entities/User';
import { UserRating } from '../../../src/entities/UserRating';

const request: SuperTest<Test> = agent(app);

const genre = new Genre();
genre.name = 'Animation';

const user = new User();
user.name = 'Test';
user.surname = 'Test';
user.email = 'test@test.co';
user.password = bcrypt.hashSync('secret', 10);
user.admin = true;

const user2 = new User();
user2.name = 'Test2';
user2.surname = 'Test2';
user2.email = 'test2@test.co';
user2.password = bcrypt.hashSync('secret', 10);

const movie = new Movie();
movie.imdbId = 'tt0001';
movie.title = 'Test movie';
movie.year = new Date().getFullYear();
movie.rating = 'PG-13';
movie.releaseDate = new Date().toString();
movie.genres = [];
movie.genres.push(genre);
movie.director = 'John Smith';
movie.plot = 'Some interesting plot';
movie.poster = 'some poster link';
movie.type = 'movie';
movie.production = 'Some production name';
movie.usersRatings = [];

const userRating = new UserRating();
userRating.user = user;
userRating.rating = 1;
userRating.createdAt = new Date().toString();
const userRating2 = new UserRating();
userRating2.user = user2;
userRating2.rating = 0;
userRating2.createdAt = new Date().toString();

movie.usersRatings.push(userRating);
movie.usersRatings.push(userRating2);

describe('Movies - recommendations', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;
    let token: string = '';

    beforeEach(async () => {
        try {
            connection = await createConnection();
            repository = getRepository(Movie);
            const usersRepository = getRepository(User);
            await usersRepository.save(user);
            await usersRepository.save(user2);
            await repository.save(movie);
            const response: Response = await request
                .post('/auth/login')
                .type('form')
                .send({ email: user.email, password: 'secret' });
            if (response.status === 200) {
                token = response.body.token;
            }
        } catch (error) {
            throw new Error(error.message);
        }
        moxios.install();
    }, 20000);

    afterEach(async () => {
        try {
            await connection.dropDatabase();
            await connection.close();
        } catch (error) {
            throw new Error(error.message);
        }
        moxios.uninstall();
    }, 20000);

    it('should respond with status code 200 for getting recommendations', async () => {
        const recommenderUrl = config.get('recommenderUrl');
        moxios.stubRequest(`${recommenderUrl}/movies/1/recommendations?take=10&skip=0`, {
            status: 200,
            response: {
                userId: 1,
                ratedItemsCount: 1,
                ratingsCount: 1,
                recommendations: [
                    { id: 1, similarity: 0.1, average_rating: 1, ratings_count: 1, penalized: 0 }
                ]
            }
        });

        const response: Response = await request
            .get('/movies/1/recommendations')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('response should have stats', async () => {
        const recommenderUrl = config.get('recommenderUrl');
        moxios.stubRequest(`${recommenderUrl}/movies/1/recommendations?take=10&skip=0`, {
            status: 200,
            response: {
                userId: 1,
                ratedItemsCount: 1,
                ratingsCount: 1,
                recommendations: [
                    { id: 1, similarity: 0.2, average_rating: 1, ratings_count: 1, penalized: 0 }
                ]
            }
        });

        const response: Response = await request
            .get('/movies/1/recommendations');
        const movie = response.body[0];

        expect(movie).toHaveProperty('avgRating');
        expect(movie).toHaveProperty('ratingsCount');
        expect(movie).toHaveProperty('penalized');
    });

    it('stats from recommender should correspond with stats in response', async () => {
        const recommenderUrl = config.get('recommenderUrl');
        const recommendations = [
            { id: 1, similarity: 0.3, average_rating: 1, ratings_count: 1, penalized: 0 }
        ];
        moxios.stubRequest(`${recommenderUrl}/movies/1/recommendations?take=10&skip=0`, {
            status: 200,
            response: {
                recommendations,
                userId: 1,
                ratedItemsCount: 1,
                ratingsCount: 1
            }
        });
        const response: Response = await request
            .get('/movies/1/recommendations');
        const movies = response.body;
        const movie = movies[0];
        const recForMovie = recommendations.find(item => item.id === movie.id);

        expect(movie.similarity).toEqual(recForMovie.similarity);
        expect(movie.avgRating).toEqual(recForMovie.average_rating);
        expect(movie.ratingsCount).toEqual(recForMovie.ratings_count);
        expect(movie.penalized).toEqual(recForMovie.penalized);
    });

    it('should respond with status code 400 for no recommendations', async () => {
        const recommenderUrl = config.get('recommenderUrl');
        moxios.stubRequest(`${recommenderUrl}/movies/1/recommendations?take=10&skip=0`, {
            status: 200,
            response: {
                recommendations: []
            }
        });

        const response: Response = await request
            .get('/movies/1/recommendations');

        expect(response.status).toBe(400);
    });
});
