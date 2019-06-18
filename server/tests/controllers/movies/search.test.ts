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

const genre2 = new Genre();
genre2.name = 'Horror';

const user = new User();
user.name = 'Test';
user.surname = 'Test';
user.email = 'test@test.co';
user.password = 'secret';

const user2 = new User();
user2.name = 'Test2';
user2.surname = 'Test2';
user2.email = 'test@test.co';
user2.password = 'secret';

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

const movie2 = new Movie();
movie2.imdbId = 'tt0001';
movie2.title = 'Test2 movie';
movie2.year = new Date().getFullYear();
movie2.rating = 'PG-13';
movie2.releaseDate = new Date().toString();
movie2.genres = [];
movie2.genres.push(genre2);
movie2.director = 'John Smith';
movie2.plot = 'Some interesting plot';
movie2.poster = 'some poster link';
movie2.type = 'series';
movie2.production = 'Some production name';

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

describe('Search - search by query', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;

    beforeAll(async () => {
        try {
            connection = await createConnection();
            repository = getRepository(Movie);
            const usersRepository = getRepository(User);
            await usersRepository.save(user);
            await usersRepository.save(user2);
            await repository.save(movie);
            await repository.save(movie2);
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
            .get('/movies/search?query=test');

        expect(response.status).toBe(200);
    });

    it('number of movies in response should match number of movies in database', async () => {
        const searchQuery = 'test';
        const response: Response = await request
            .get(`/movies/search?query=${searchQuery}`);
        const query = repository
            .createQueryBuilder('movies')
            .where('LOWER(movies.title) LIKE :query', { query: `%${searchQuery}%` });
        const count = await query.getCount();
        const { movies } = response.body;

        expect(movies).toBeDefined();
        expect(Array.isArray(movies)).toBeTruthy();
        expect(movies.length).toEqual(count);
    });

    it('should respond with status code 400 for title that doesn\'t exist', async () => {
        const response: Response = await request
            .get('/movies/search?query=x-men');

        expect(response.status).toBe(400);
    });

    it('response should have stats', async () => {
        const response: Response = await request
            .get('/movies/search?query=test');
        const { movies } = response.body;
        const movie = movies[0];

        expect(movie).toHaveProperty('avgRating');
        expect(movie).toHaveProperty('ratingsCount');
        expect(movie).toHaveProperty('penalized');
    });
});

describe('Search - search by genre', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;

    beforeAll(async () => {
        try {
            connection = await createConnection();
            repository = getRepository(Movie);
            const usersRepository = getRepository(User);
            await usersRepository.save(user);
            await usersRepository.save(user2);
            await repository.save(movie);
            await repository.save(movie2);
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
            .get('/movies/search?genres=1');

        expect(response.status).toBe(200);
    });

    it('number of movies in response should match number of movies in database', async () => {
        const genres = [1];
        const response: Response = await request
            .get(`/movies/search?genres=${genres.join(',')}`);
        const query = repository
            .createQueryBuilder('movies')
            .leftJoin('movies.genres', 'genres')
            .where('genres.id IN (:genres)', { genres });
        const count = await query.getCount();
        const { movies } = response.body;

        expect(movies).toBeDefined();
        expect(Array.isArray(movies)).toBeTruthy();
        expect(movies.length).toEqual(count);
    });

    it('should respond with status code 400 for genre that doesn\'t exist', async () => {
        const response: Response = await request
            .get('/movies/search?genres=5');

        expect(response.status).toBe(400);
    });

    it('response should have stats', async () => {
        const response: Response = await request
            .get('/movies/search?genres=1');
        const { movies } = response.body;
        const movie = movies[0];

        expect(movie).toHaveProperty('avgRating');
        expect(movie).toHaveProperty('ratingsCount');
        expect(movie).toHaveProperty('penalized');
    });
});
