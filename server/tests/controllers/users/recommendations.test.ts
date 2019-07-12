import * as moxios from 'moxios';
import * as config from 'config';
import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import { agent, Response, SuperTest, Test } from 'supertest';
import { User } from '../../../src/entities/User';
import app from '../../../src/app';
import { Movie } from '../../../src/entities/Movie';
import { UserRating } from '../../../src/entities/UserRating';
import { genre, genre2, user, user2, movie, movie2, userRating, userRating2 } from '../../helpers';

const request: SuperTest<Test> = agent(app);

movie.genres.push(genre);
movie2.genres.push(genre2);
movie.usersRatings.push(userRating);
movie.usersRatings.push(userRating2);

const recommenderUrl = config.get('recommenderUrl');
const recommendations = [
    { id: 1, rating: 0.5, similarity: 0.3, average_rating: 1, ratings_count: 1, penalized: 0, es_score: 0.1 }
];
const responseStub = {
    status: 200,
    response: {
        recommendations
    }
};

describe('Users - recommendations', () => {
    let connection: Connection = null;
    let repository: Repository<User> = null;
    let moviesRepository: Repository<Movie> = null;
    let ratingsRepository: Repository<UserRating> = null;
    let token: string = '';

    beforeAll(async() => {
        try {
            connection = await createConnection();
            repository = getRepository(User);
            moviesRepository = getRepository(Movie);
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
            await repository.save(user);
            await repository.save(user2);
            await moviesRepository.save(movie);
            await moviesRepository.save(movie2);
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
            await moviesRepository.delete({});
        } catch (error) {
            throw new Error(error.message);
        }
        moxios.uninstall();
    }, 20000);

    it('should respond with status code 200', async () => {
        const id = user.id;
        moxios.stubRequest(`${recommenderUrl}/users/${id}/recommendations?take=10&skip=0`, responseStub);
        const response: Response = await request
            .get(`/users/${id}/recommendations`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should respond with status code 200 with specified genre', async () => {
        const id = user.id;
        moxios.stubRequest(`${recommenderUrl}/users/${id}/recommendations?take=10&skip=0&genres=1`, responseStub);
        const response: Response = await request
            .get(`/users/${id}/recommendations?genres=1`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should respond with status code 400 when recommender returns no recommendations', async () => {
        const id = user.id;
        moxios.stubRequest(`${recommenderUrl}/users/${id}/recommendations?take=10&skip=0`, {
            ...responseStub,
            response: {
                recommendations: []
            }
        });
        const response: Response = await request
            .get(`/users/${id}/recommendations`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('response should have desired keys', async () => {
        const id = user.id;
        moxios.stubRequest(`${recommenderUrl}/users/${id}/recommendations?take=10&skip=0`, responseStub);
        const response: Response = await request
            .get(`/users/${id}/recommendations`)
            .set('Authorization', `Bearer ${token}`);
        const movies = response.body;
        const movie = movies[0];

        expect(movie).toHaveProperty('ratedSimilarity');
        expect(movie).toHaveProperty('rating');
        expect(movie).toHaveProperty('avgRating');
        expect(movie).toHaveProperty('ratingsCount');
        expect(movie).toHaveProperty('penalized');
        expect(movie).toHaveProperty('esScore');
    });

    it('response should have stats corresponding to response from recommender', async () => {
        const id = user.id;
        moxios.stubRequest(`${recommenderUrl}/users/${id}/recommendations?take=10&skip=0`, responseStub);
        const response: Response = await request
            .get(`/users/${id}/recommendations`)
            .set('Authorization', `Bearer ${token}`);
        const movies = response.body;
        const movie = movies[0];
        const statsForMovie = recommendations.find(item => item.id === movie.id);

        expect(movie.rating).toEqual(statsForMovie.rating);
        expect(movie.ratedSimilarity).toEqual(statsForMovie.similarity);
        expect(movie.avgRating).toEqual(statsForMovie.average_rating);
        expect(movie.ratingsCount).toEqual(statsForMovie.ratings_count);
        expect(movie.penalized).toEqual(statsForMovie.penalized);
        expect(movie.esScore).toEqual(statsForMovie.es_score);
    });
});
