import { agent, Response, SuperTest, Test } from 'supertest';
import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import app from '../../src/app';
import { Movie } from '../../src/entities/Movie';
import { Genre } from '../../src/entities/Genre';

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

describe('GET /genres', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;

    beforeAll(async () => {
        try {
            connection = await createConnection();
            repository = getRepository(Movie);
            await repository.save(movie);
        } catch (error) {
            console.log(error.message);
            throw new Error('Error while connecting to database');
        }
    }, 20000);

    afterAll(async () => {
        try {
            await connection.dropDatabase();
            await connection.close();
        } catch (error) {
            console.log(error.message);
            throw new Error('Error while disconnecting from database');
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
});
