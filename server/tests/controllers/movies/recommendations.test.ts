import * as moxios from 'moxios';
import * as config from 'config';
import { agent, Response, SuperTest, Test } from 'supertest';
import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import app from '../../../src/app';
import { Movie } from '../../../src/entities/Movie';
import { User } from '../../../src/entities/User';
import { UserRating } from '../../../src/entities/UserRating';
import { genre, user, user2, movie, userRating, userRating2 } from '../../helpers';

const request: SuperTest<Test> = agent(app);

movie.genres.push(genre);
movie.usersRatings.push(userRating);
movie.usersRatings.push(userRating2);
const recommenderUrl = config.get('recommenderUrl');
const recommendations = [
    { id: 1, similarity: 0.3, average_rating: 1, ratings_count: 1, penalized: 0, es_score: 0.1 }
];
const responseStub = {
    status: 200,
    response: {
        recommendations
    }
};

describe('Movies - recommendations', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;
    let usersRepository: Repository<User> = null;
    let ratingsRepository: Repository<UserRating> = null;
    let token: string = '';

    beforeAll(async() => {
        try {
            connection = await createConnection();
            usersRepository = getRepository(User);
            repository = getRepository(Movie);
            ratingsRepository = getRepository(UserRating);
        } catch (error) {
            throw new Error(error.message);
        }
    }, 20000);

    afterAll(async() => {
        try {
            await connection.dropDatabase();
            await connection.close();
        } catch (error) {
            throw new Error(error.message);
        }
    }, 20000);

    beforeEach(async () => {
        try {
            await usersRepository.save(user);
            await usersRepository.save(user2);
            await repository.save(movie);
            const response: Response = await request.post('/auth/login').type('form')
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
            await ratingsRepository.delete({});
            await repository.delete({});
            await usersRepository.delete({});
        } catch (error) {
            throw new Error(error.message);
        }
        moxios.uninstall();
    }, 20000);

    it('should respond with status code 200 for getting recommendations', async () => {
        moxios.stubRequest(`${recommenderUrl}/movies/1/recommendations?take=10&skip=0`, responseStub);

        const response: Response = await request
            .get('/movies/1/recommendations')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('response should have stats', async () => {
        moxios.stubRequest(`${recommenderUrl}/movies/1/recommendations?take=10&skip=0`, responseStub);

        const response: Response = await request
            .get('/movies/1/recommendations');
        const movie = response.body[0];

        expect(movie).toHaveProperty('avgRating');
        expect(movie).toHaveProperty('ratingsCount');
        expect(movie).toHaveProperty('penalized');
        expect(movie).toHaveProperty('esScore');
    });

    it('stats from recommender should correspond with stats in response', async () => {
        moxios.stubRequest(`${recommenderUrl}/movies/1/recommendations?take=10&skip=0`, responseStub);
        const response: Response = await request
            .get('/movies/1/recommendations');
        const movies = response.body;
        const movie = movies[0];
        const recForMovie = recommendations.find(item => item.id === movie.id);

        expect(movie.similarity).toEqual(recForMovie.similarity);
        expect(movie.avgRating).toEqual(recForMovie.average_rating);
        expect(movie.ratingsCount).toEqual(recForMovie.ratings_count);
        expect(movie.penalized).toEqual(recForMovie.penalized);
        expect(movie.esScore).toEqual(recForMovie.es_score);
    });

    it('should respond with status code 400 for no recommendations', async () => {
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
