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

const movie2 = new Movie();
movie2.imdbId = 'tt0001';
movie2.title = 'Test movie';
movie2.year = new Date().getFullYear();
movie2.rating = 'PG-13';
movie2.releaseDate = new Date().toString();
movie2.genres = [];
movie2.genres.push(genre);
movie2.director = 'John Smith';
movie2.plot = 'Some interesting plot';
movie2.poster = 'some poster link';
movie2.type = 'series';
movie2.production = 'Some production name';

describe('GET /movies', () => {
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
            .get('/movies');

        expect(response.status).toBe(200);
    });

    it('should respond with status code 200 with genre', async () => {
        const response: Response = await request
            .get('/movies?genre=animation');

        expect(response.status).toBe(200);
    });

    it('should respond with status code 400 with genre that doesn\'t exist', async () => {
        const response: Response = await request
            .get('/movies?genre=horror');

        expect(response.status).toBe(400);
    });

    it('should respond with status code 200 with type', async () => {
        const response: Response = await request
            .get('/movies?type=movie');

        expect(response.status).toBe(200);
    });

    it('should respond with status code 400 with type that doesn\'t exist', async () => {
        const response: Response = await request
            .get('/movies?type=series');

        expect(response.status).toBe(400);
    });
});

describe('GET /movies/search/:title', () => {
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
            .get('/movies/search/test');

        expect(response.status).toBe(200);
    });

    it('should respond with status code 400 for title that doesn\'t exist', async () => {
        const response: Response = await request
            .get('/movies/search/x-men');

        expect(response.status).toBe(400);
    });
});

describe('GET /movies/count/:type', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;

    beforeAll(async () => {
        try {
            connection = await createConnection();
            repository = getRepository(Movie);
            await repository.save(movie);
            await repository.save(movie2);
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
            .get('/movies/count/all');

        expect(response.status).toBe(200);
    });

    it('should match count of movies from database', async () => {
        const response = await request
            .get('/movies/count/all');

        const { count } = response.body;

        const moviesCount = await repository
            .createQueryBuilder('movies')
            .getCount();

        expect(count).toEqual(moviesCount);
    });

    it('should match count of movies from database with specific type', async () => {
        const response = await request
            .get('/movies/count/movie');

        const { count } = response.body;

        const moviesCount = await repository
            .createQueryBuilder('movies')
            .where('movies.type = :type', { type: 'movie' })
            .getCount();

        expect(count).toEqual(moviesCount);
    });

    it('should match count of movies from database with specific genre', async () => {
        const response = await request
            .get('/movies/count/all?type=animation');

        const { count } = response.body;

        const moviesCount = await repository
            .createQueryBuilder('movies')
            .leftJoin('movies.genres', 'genres')
            .where('LOWER(genres.name) = LOWER(:genre)', { genre: 'animation' })
            .getCount();

        expect(count).toEqual(moviesCount);
    });
});

describe('GET /movies/:id', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;

    beforeAll(async () => {
        try {
            connection = await createConnection();
            repository = getRepository(Movie);
            await repository.save(movie);
            await repository.save(movie2);
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
        const id = 1;
        const response: Response = await request
            .get(`/movies/${id}`);

        expect(response.status).toBe(200);
    });

    it('should match movie in database with same id', async () => {
        const id = 1;
        const response: Response = await request
            .get(`/movies/${id}`);

        const movie = await repository
            .createQueryBuilder('movie')
            .where('movie.id = :id', { id })
            .getOne();

        expect(response.body.title).toEqual(movie.title);
    });

    it('should respond with status code 400 for movie that doesn\'t exist', async () => {
        const id = 100000;
        const response: Response = await request
            .get(`/movies/${id}`);

        expect(response.status).toBe(400);
    });
});
