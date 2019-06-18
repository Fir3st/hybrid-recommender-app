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

describe('Ratings', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;
    let token: string = '';

    beforeAll(async () => {
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
    }, 20000);

    afterAll(async () => {
        try {
            await connection.dropDatabase();
            await connection.close();
        } catch (error) {
            throw new Error(error.message);
        }
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
            .get('/movies/1/ratings')
            .set('Authorization', `Bearer ${token}`);

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
        await ratingsRepository.delete({ userId: 1 });

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
