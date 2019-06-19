import * as moxios from 'moxios';
import * as config from 'config';
import { agent, Response, SuperTest, Test } from 'supertest';
import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import app from '../../src/app';
import { Movie } from '../../src/entities/Movie';
import { User } from '../../src/entities/User';
import { UserRating } from '../../src/entities/UserRating';
import { genre, genre2, user, user2, movie, movie2, userRating, userRating2 } from '../helpers';

const request: SuperTest<Test> = agent(app);

movie.genres.push(genre);
movie2.genres.push(genre2);
movie.usersRatings.push(userRating);
movie.usersRatings.push(userRating2);

describe('Analytics', () => {
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

    it('should respond with status code 200 for getting ratings values distribution', async () => {
        const response: Response = await request
            .get('/analytics/ratings-values-distribution')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should respond with status code 401 for getting ratings values distribution for unauthenticated user', async () => {
        const response: Response = await request
            .get('/analytics/ratings-values-distribution');

        expect(response.status).toBe(401);
    });

    it('should respond with status code 403 for getting ratings values distribution for logged user without admin', async () => {
        const loginResponse: Response = await request.post('/auth/login').type('form')
            .send({ email: user2.email, password: 'secret' });
        if (loginResponse.status === 200) {
            token = loginResponse.body.token;
        }
        const response: Response = await request
            .get('/analytics/ratings-values-distribution')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('ratings values distribution response should be non-empty array', async () => {
        const response: Response = await request
            .get('/analytics/ratings-values-distribution')
            .set('Authorization', `Bearer ${token}`);

        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length > 0).toBeTruthy();
    });

    it('should respond with status code 200 for getting ratings distribution', async () => {
        const response: Response = await request
            .get('/analytics/ratings-distribution')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('ratings distribution response should be non-empty array', async () => {
        const response: Response = await request
            .get('/analytics/ratings-distribution')
            .set('Authorization', `Bearer ${token}`);

        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length > 0).toBeTruthy();
    });

    it('should respond with status code 200 for getting similarities distribution', async () => {
        const recommenderUrl = config.get('recommenderUrl');
        moxios.stubRequest(`${recommenderUrl}/movies/similarities-distribution`, {
            status: 200,
            response: [
                { startValue: 0, endValue: 1, count: 10 }
            ]
        });
        const response: Response = await request
            .get('/analytics/similarities-distribution')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should respond with status code 400 for getting similarities distribution with no similarities in response from recommender', async () => {
        const recommenderUrl = config.get('recommenderUrl');
        moxios.stubRequest(`${recommenderUrl}/movies/similarities-distribution`, {
            status: 200,
            response: [
            ]
        });
        const response: Response = await request
            .get('/analytics/similarities-distribution')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });
});
