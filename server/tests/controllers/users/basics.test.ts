import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import { agent, Response, SuperTest, Test } from 'supertest';
import { User } from '../../../src/entities/User';
import app from '../../../src/app';
import { user, user2, movie, userRating, genre } from '../../helpers';
import { Movie } from '../../../src/entities/Movie';
import { UserRating } from '../../../src/entities/UserRating';

const request: SuperTest<Test> = agent(app);
movie.usersRatings.push(userRating);
movie.genres.push(genre);

describe('Basics for /users', () => {
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
            const response: Response = await request.post('/auth/login').type('form')
                .send({ email: user.email, password: 'secret' });
            if (response.status === 200) {
                token = response.body.token;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }, 20000);

    afterEach(async () => {
        try {
            await ratingsRepository.delete({});
            await repository.delete({});
            await moviesRepository.delete({});
        } catch (error) {
            throw new Error(error.message);
        }
    }, 20000);

    it('should respond with status 401 if request is not authenticated', async () => {
        const response: Response = await request.get('/users');

        expect(response.status).toBe(401);
    });

    it('should respond with status code 403 for logged user without admin', async () => {
        const loginResponse: Response = await request.post('/auth/login').type('form')
            .send({ email: user2.email, password: 'secret' });
        if (loginResponse.status === 200) {
            token = loginResponse.body.token;
        }
        const response: Response = await request
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('should respond with status code 200 for logged user with admin', async () => {
        const response: Response = await request
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('number of users in response should correspond with number of users in database', async () => {
        const usersCount = await repository
            .createQueryBuilder('users')
            .getCount();

        const response: Response = await request
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        const count = response.body.length;

        expect(usersCount).toEqual(count);
    });

    it('should respond with status code 200 for for creating user with correct data', async () => {
        const response: Response = await request
            .post('/users')
            .type('form')
            .send({ email: 'test3@test.co', password: 'secret', name: 'Test', surname: 'Test' });

        expect(response.status).toBe(200);
    });

    it('should respond with status code 200 for for creating user with incorrect data', async () => {
        const response: Response = await request
            .post('/users')
            .type('form')
            .send({ email: 'test3@test.co', password: 'secret' });

        expect(response.status).toBe(400);
    });

    it('count in response should correspond with number of users in database', async () => {
        const usersCount = await repository
            .createQueryBuilder('users')
            .getCount();

        const response: Response = await request
            .get('/users/count')
            .set('Authorization', `Bearer ${token}`);
        const count = response.body.count;

        expect(usersCount).toEqual(count);
    });

    it('status code should be 401 for /count for unauthenticated user', async () => {
        const response: Response = await request
            .get('/users/count');

        expect(response.status).toBe(401);
    });

    it('status code should be 403 for /count for logged user without admin', async () => {
        const loginResponse: Response = await request.post('/auth/login').type('form')
            .send({ email: user2.email, password: 'secret' });
        if (loginResponse.status === 200) {
            token = loginResponse.body.token;
        }
        const response: Response = await request
            .get('/users/count')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('status code should be 401 for /me for unauthenticated user', async () => {
        const response: Response = await request
            .get('/users/me');

        expect(response.status).toBe(401);
    });

    it('/me should return user corresponding to logged user', async () => {
        const response: Response = await request
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`);
        const { user: respUser  } = response.body;

        expect(user.id).toEqual(respUser.id);
    });

    it('/:id should return user with corresponding ID', async () => {
        const id = user2.id;
        const response: Response = await request
            .get(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`);
        const respUser = response.body;

        expect(id).toEqual(respUser.id);
    });

    it('/:id should response with status code 401 for unauthenticated user', async () => {
        const id = user2.id;
        const response: Response = await request
            .get(`/users/${id}`);

        expect(response.status).toBe(401);
    });

    it('/:id should response with status code 403 for logged user without admin', async () => {
        const loginResponse: Response = await request.post('/auth/login').type('form')
            .send({ email: user2.email, password: 'secret' });
        if (loginResponse.status === 200) {
            token = loginResponse.body.token;
        }
        const id = user.id;
        const response: Response = await request
            .get(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('/:id/preferences should response with status code 401 for unauthenticated user', async () => {
        const id = user.id;
        const response: Response = await request
            .get(`/users/${id}/preferences`);

        expect(response.status).toBe(401);
    });

    it('/:id/preferences should response with status code 403 for logged user without admin', async () => {
        const loginResponse: Response = await request.post('/auth/login').type('form')
            .send({ email: user2.email, password: 'secret' });
        if (loginResponse.status === 200) {
            token = loginResponse.body.token;
        }
        const id = user.id;
        const response: Response = await request
            .get(`/users/${id}/preferences`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('/:id/preferences should return array of preferences', async () => {
        const id = user.id;
        const response: Response = await request
            .get(`/users/${id}/preferences`)
            .set('Authorization', `Bearer ${token}`);

        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length > 0).toBeTruthy();
    });

    it('preferences should have desired keys', async () => {
        const id = user.id;
        const response: Response = await request
            .get(`/users/${id}/preferences`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.body.length > 0).toBeTruthy();
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('count');
        expect(response.body[0]).toHaveProperty('value');
        expect(response.body[0]).toHaveProperty('avg');
    });
});
