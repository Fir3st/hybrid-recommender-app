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

describe('Movies - ratings', () => {
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

    it('should respond with status code 200', async () => {
        const response: Response = await request
            .get('/movies/1/ratings')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('number of ratings in response should match number of ratings in database', async () => {
        const id = 1;
        const ratingsRepository = getRepository(UserRating);
        const response: Response = await request
            .get(`/movies/${id}/ratings`)
            .set('Authorization', `Bearer ${token}`);
        const query = ratingsRepository
            .createQueryBuilder('userRating')
            .leftJoinAndSelect('userRating.user', 'user')
            .andWhere('userRating.movieId = :id', { id });
        const count = await query.getCount();
        const ratings = response.body;

        expect(ratings).toBeDefined();
        expect(Array.isArray(ratings)).toBeTruthy();
        expect(ratings.length).toEqual(count);
    });

    it('should respond with status code 401 without Authorization header', async () => {
        const response: Response = await request
            .get('/movies/1/ratings');

        expect(response.status).toBe(401);
    });

    it('should respond with status code 403 for user without admin', async () => {
        const loginResponse: Response = await request
            .post('/auth/login')
            .type('form')
            .send({ email: user2.email, password: 'secret' });
        if (loginResponse.status === 200) {
            token = loginResponse.body.token;
        }
        const response: Response = await request
            .get('/movies/1/ratings')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('should respond with status code 200 for getting user\'s rating for movie', async () => {
        const response: Response = await request
            .get('/movies/1/rating')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should respond with status code 401 for getting user\'s rating for movie without Authorization header', async () => {
        const response: Response = await request
            .get('/movies/1/rating');

        expect(response.status).toBe(401);
    });

    it('should respond with status code 400 for getting user\'s rating for non-existing movie', async () => {
        const response: Response = await request
            .get('/movies/50/rating')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('should respond with status code 400 for getting user\'s rating without rating it', async () => {
        const ratingsRepository = getRepository(UserRating);
        await ratingsRepository.delete({ userId: 1, movieId: 1 });

        const response: Response = await request
            .get('/movies/1/rating')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('should respond with status code 200 for getting movie\'s average rating', async () => {
        const response: Response = await request
            .get('/movies/1/avg-rating')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should respond with status code 400 for getting movie\'s average rating for non-existing movie', async () => {
        const response: Response = await request
            .get('/movies/50/avg-rating')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('should respond with status code 200 for rating movie by user', async () => {
        const ratingsRepository = getRepository(UserRating);
        await ratingsRepository.delete({ userId: 1 });
        const recommenderUrl = config.get('recommenderUrl');
        moxios.stubRequest(`${recommenderUrl}/train/users/1`, {
            status: 200
        });

        const response: Response = await request
            .post('/movies/1/rating')
            .type('form')
            .send({ rating: 2 })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });
});
