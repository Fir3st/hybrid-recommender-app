import * as moxios from 'moxios';
import * as config from 'config';
import { agent, Response, SuperTest, Test } from 'supertest';
import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import app from '../../../src/app';
import { Movie } from '../../../src/entities/Movie';
import { User } from '../../../src/entities/User';
import { UserRating } from '../../../src/entities/UserRating';
import { genre, genre2, user, user2, movie, movie2, userRating, userRating2 } from '../../helpers';

const request: SuperTest<Test> = agent(app);

movie.genres.push(genre);
movie2.genres.push(genre2);
movie.usersRatings.push(userRating);
movie.usersRatings.push(userRating2);

const recommenderUrl = config.get('recommenderUrl');
const ratings = [
    { id: 1, rating: 0.5, similarity: 0.05 },
    { id: 2, rating: 1.5, similarity: 0.15 }
];
const recommendations = [
    { id: 1, rating: 0.5, similarity: 0.3, average_rating: 1, ratings_count: 1, penalized: 0 }
];
const responseStub = {
    status: 200,
    response: {
        ratings
    }
};
const responseStubRecs = {
    status: 200,
    response: {
        recommendations
    }
};

describe('Search - search by query', () => {
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
            await repository.save(movie2);
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
            await repository.save(movie2);
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

describe('Secured search - search by query', () => {
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
            await repository.save(movie2);
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
        moxios.stubRequest(`${recommenderUrl}/search/1`, responseStub);
        const response: Response = await request
            .get('/movies/secured-search?query=test')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should respond with status code 401 without Authorization header', async () => {
        const response: Response = await request
            .get('/movies/secured-search?query=test');

        expect(response.status).toBe(401);
    });

    it('number of movies in response should match number of movies in database', async () => {
        moxios.stubRequest(`${recommenderUrl}/search/1`, responseStub);
        const searchQuery = 'test';
        const response: Response = await request
            .get(`/movies/secured-search?query=${searchQuery}`)
            .set('Authorization', `Bearer ${token}`);
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
            .get('/movies/secured-search?query=x-men')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('response should have stats', async () => {
        moxios.stubRequest(`${recommenderUrl}/search/1`, responseStub);
        const response: Response = await request
            .get('/movies/secured-search?query=test')
            .set('Authorization', `Bearer ${token}`);
        const { movies } = response.body;
        const movie = movies[0];

        expect(movie).toHaveProperty('avgRating');
        expect(movie).toHaveProperty('ratingsCount');
        expect(movie).toHaveProperty('penalized');
    });

    it('stats from recommender should correspond with stats in response', async () => {
        moxios.stubRequest(`${recommenderUrl}/search/1`, responseStub);
        const response: Response = await request
            .get('/movies/secured-search?query=test')
            .set('Authorization', `Bearer ${token}`);
        const { movies } = response.body;
        const movie = movies[0];
        const ratingForMovie = ratings.find(item => item.id === movie.id);

        expect(movie.rating).toEqual(ratingForMovie.rating);
        expect(movie.ratedSimilarity).toEqual(ratingForMovie.similarity);
    });

    it('items in response should be ordered by rating', async () => {
        moxios.stubRequest(`${recommenderUrl}/search/1`, responseStub);
        const response: Response = await request
            .get('/movies/secured-search?query=test')
            .set('Authorization', `Bearer ${token}`);
        const { movies } = response.body;

        expect(movies[0].rating > movies[1].rating).toBeTruthy();
    });
});

describe('Secured search - search by genre', () => {
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
            await repository.save(movie2);
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
        moxios.stubRequest(`${recommenderUrl}/search/1?take=10&skip=0&includeRated=false&genres=1`, responseStubRecs);
        const response: Response = await request
            .get('/movies/secured-search?genres=1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should respond with status code 401 without Authorization header', async () => {
        const response: Response = await request
            .get('/movies/secured-search?genres=1');

        expect(response.status).toBe(401);
    });

    it('number of movies in response should match number of movies in database', async () => {
        moxios.stubRequest(`${recommenderUrl}/search/1?take=10&skip=0&includeRated=false&genres=1`, responseStubRecs);
        const genres = [1];
        const response: Response = await request
            .get(`/movies/secured-search?genres=${genres.join(',')}`)
            .set('Authorization', `Bearer ${token}`);
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
        moxios.stubRequest(`${recommenderUrl}/search/1?take=10&skip=0&includeRated=false&genres=5`, {
            ...responseStubRecs,
            response: {
                recommendations: []
            }
        });
        const response: Response = await request
            .get('/movies/secured-search?genres=5')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('response should have stats', async () => {
        moxios.stubRequest(`${recommenderUrl}/search/1?take=10&skip=0&includeRated=false&genres=1`, responseStubRecs);
        const response: Response = await request
            .get('/movies/secured-search?genres=1')
            .set('Authorization', `Bearer ${token}`);
        const { movies } = response.body;
        const movie = movies[0];

        expect(movie).toHaveProperty('ratedSimilarity');
        expect(movie).toHaveProperty('rating');
        expect(movie).toHaveProperty('avgRating');
        expect(movie).toHaveProperty('ratingsCount');
        expect(movie).toHaveProperty('penalized');
    });

    it('stats from recommender should correspond with stats in response', async () => {
        moxios.stubRequest(`${recommenderUrl}/search/1?take=10&skip=0&includeRated=false&genres=1`, responseStubRecs);
        const response: Response = await request
            .get('/movies/secured-search?genres=1')
            .set('Authorization', `Bearer ${token}`);
        const { movies } = response.body;
        const movie = movies[0];
        const statsForMovie = recommendations.find(item => item.id === movie.id);

        expect(movie.rating).toEqual(statsForMovie.rating);
        expect(movie.ratedSimilarity).toEqual(statsForMovie.similarity);
        expect(movie.avgRating).toEqual(statsForMovie.average_rating);
        expect(movie.ratingsCount).toEqual(statsForMovie.ratings_count);
        expect(movie.penalized).toEqual(statsForMovie.penalized);
    });
});
