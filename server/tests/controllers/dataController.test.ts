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

describe('Data', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;
    let usersRepository: Repository<User> = null;
    let ratingsRepository: Repository<UserRating> = null;

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
        } catch (error) {
            throw new Error(error.message);
        }
    }, 20000);

    afterEach(async () => {
        try {
            await ratingsRepository.delete({});
            await repository.delete({});
            await usersRepository.delete({});
        } catch (error) {
            throw new Error(error.message);
        }
    }, 20000);

    it('should respond with status code 200 for movies data', async () => {
        const response: Response = await request
            .get('/data/movies');

        expect(response.status).toBe(200);
    });

    it('respond should have desired keys', async () => {
        const response: Response = await request
            .get('/data/movies');
        const movie = response.body[0];

        expect(movie).toHaveProperty('title');
        expect(movie).toHaveProperty('average_rating');
        expect(movie).toHaveProperty('count');
        expect(movie).toHaveProperty('penalized');
    });
});
