import { agent, Response, SuperTest, Test } from 'supertest';
import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import app from '../../../src/app';
import { Movie } from '../../../src/entities/Movie';
import { Genre } from '../../../src/entities/Genre';
import { genre, movie } from '../../helpers';

const request: SuperTest<Test> = agent(app);

movie.genres.push(genre);

describe('Basics for /genres', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;
    let genresRepository: Repository<Genre> = null;

    beforeAll(async () => {
        try {
            connection = await createConnection();
            repository = getRepository(Movie);
            genresRepository = getRepository(Genre);
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
