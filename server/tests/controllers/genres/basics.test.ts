import { agent, Response, SuperTest, Test } from 'supertest';
import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import app from '../../../src/app';
import { Movie } from '../../../src/entities/Movie';
import { Genre } from '../../../src/entities/Genre';

const request: SuperTest<Test> = agent(app);

const movie = new Movie();
movie.imdbId = 'tt0001';
movie.title = 'Test movie';
movie.year = new Date().getFullYear();
movie.rating = 'PG-13';
movie.releaseDate = new Date().toString();
movie.genres = [];
const genre = new Genre();
genre.name = 'Animation';
movie.genres.push(genre);
movie.director = 'John Smith';
movie.plot = 'Some interesting plot';
movie.poster = 'some poster link';
movie.type = 'movie';
movie.production = 'Some production name';

describe('Basics for /genres', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;

    beforeAll(async () => {
        try {
            connection = await createConnection();
            repository = getRepository(Movie);
            await repository.save(movie);
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
            .get('/genres?type=movie');

        expect(response.status).toBe(200);
    });

    it('should respond with status code 400 with type that doesn\'t exist', async () => {
        const response: Response = await request
            .get('/genres?type=series');

        expect(response.status).toBe(400);
    });

    it('number of genres should correspond to number of genres of movie', async () => {
        const genresRepository = getRepository(Genre);

        const response: Response = await request
            .get('/genres?type=movie');
        const query = genresRepository
            .createQueryBuilder('genres')
            .innerJoin('genres.movies', 'movies')
            .where('movies.type = :type', { type: 'movie' });

        const genres = await query.getMany();

        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(genres.length);
    });

    it('genres in respond should correspond to genres in database', async () => {
        const genresRepository = getRepository(Genre);

        const response: Response = await request
            .get('/genres?type=movie');
        const query = genresRepository
            .createQueryBuilder('genres')
            .innerJoin('genres.movies', 'movies')
            .where('movies.type = :type', { type: 'movie' });

        const genres = await query.getMany();

        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body).toEqual(genres);
    });
});
