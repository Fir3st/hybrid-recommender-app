import * as moxios from 'moxios';
import * as config from 'config';
import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import MoviesUtil from '../../src/utils/movies/MoviesUtil';
import { Movie } from '../../src/entities/Movie';
import { User } from '../../src/entities/User';
import { UserRating } from '../../src/entities/UserRating';

const movies = [
    { id: 1, title: 'test 1' },
    { id: 2, title: 'test 2' }
];

const moviesRecommendations = [
    { id: 1, similarity: 0.5, average_rating: 4.5, ratings_count: 5, penalized: 0 },
    { id: '2', similarity: 0.1, average_rating: 1.5, ratings_count: 10, penalized: 0 }
];

const usersRecommendations = [
    { id: 1, rating: 1.5, average_rating: 4.5, ratings_count: 5, penalized: 0, similarity: 0.05 },
    { id: '2', rating: 2.1, average_rating: 1.5, ratings_count: 10, penalized: 0, similarity: 0.06 }
];

describe('getItemFromRecs', () => {
    it('should return item with given ID that is number from array of recommendations', async () => {
        const id = 1;
        const rec = MoviesUtil.getItemFromRecs(id, moviesRecommendations);

        expect(rec).toBeDefined();
    });

    it('should return item with given ID that is string from array of recommendations', async () => {
        const id = '1';
        const rec = MoviesUtil.getItemFromRecs(id, moviesRecommendations);

        expect(rec).toBeDefined();
    });

    it('should return undefined for non-existing ID', async () => {
        const id = 3;
        const rec = MoviesUtil.getItemFromRecs(id, moviesRecommendations);

        expect(rec).toBeUndefined();
    });
});

describe('getMoviesInfo', () => {
    it('should return item that contains desired stats for given key - similarity', async () => {
        const key = 'similarity';
        const moviesWithInfo = MoviesUtil.getMoviesInfo(movies, moviesRecommendations, key);
        const movie = moviesWithInfo[0];
        const recommendation = moviesRecommendations[0];

        expect(movie).toHaveProperty('avgRating');
        expect(movie).toHaveProperty('ratingsCount');
        expect(movie).toHaveProperty('penalized');
        expect(movie).toHaveProperty(key);
        expect(movie.avgRating).toEqual(recommendation.average_rating);
        expect(movie.ratingsCount).toEqual(recommendation.ratings_count);
        expect(movie.penalized).toEqual(recommendation.penalized);
        expect(movie[key]).toEqual(recommendation[key]);
    });

    it('should return item that contains desired stats for given key - rating', async () => {
        const key = 'rating';
        const moviesWithInfo = MoviesUtil.getMoviesInfo(movies, usersRecommendations, key);
        const movie = moviesWithInfo[0];
        const recommendation = usersRecommendations[0];

        expect(movie).toHaveProperty('avgRating');
        expect(movie).toHaveProperty('ratingsCount');
        expect(movie).toHaveProperty('penalized');
        expect(movie).toHaveProperty(key);
        expect(movie.avgRating).toEqual(recommendation.average_rating);
        expect(movie.ratingsCount).toEqual(recommendation.ratings_count);
        expect(movie.penalized).toEqual(recommendation.penalized);
        expect(movie[key]).toEqual(recommendation[key]);
    });

    it('if key is rating, it should also contains ratedSimilarity', async () => {
        const key = 'rating';
        const moviesWithInfo = MoviesUtil.getMoviesInfo(movies, usersRecommendations, key);

        expect(moviesWithInfo[0]).toHaveProperty('ratedSimilarity');
        expect(moviesWithInfo[0].ratedSimilarity).toEqual(usersRecommendations[0].similarity);
    });

    it('if key is similarity, it should not contains ratedSimilarity', async () => {
        const key = 'similarity';
        const moviesWithInfo = MoviesUtil.getMoviesInfo(movies, moviesRecommendations, key);

        expect(moviesWithInfo[0].ratedSimilarity).toBeUndefined();
    });
});

describe('getStatsFromRec', () => {
    it('should return avgRating, ratingsCount and penalized extracted from recommendation', async () => {
        const stats = MoviesUtil.getStatsFromRec(moviesRecommendations[0]);

        expect(stats).toHaveProperty('avgRating');
        expect(stats).toHaveProperty('ratingsCount');
        expect(stats).toHaveProperty('penalized');
    });

    it('stats should be equal to stats given by recommendation', async () => {
        const recommendation = moviesRecommendations[0];
        const stats = MoviesUtil.getStatsFromRec(recommendation);

        expect(stats.avgRating).toEqual(recommendation.average_rating);
        expect(stats.ratingsCount).toEqual(recommendation.ratings_count);
        expect(stats.penalized).toEqual(recommendation.penalized);
    });
});

describe('isPenalizedByUser', () => {
    it('should be penalized by user', async () => {
        const movie = {
            usersRatings: [
                { userId: 1, rating: 0 },
                { userId: 2, rating: 1 }
            ]
        };
        const user = { id: 1 };
        const status = MoviesUtil.isPenalizedByUser(movie, user);

        expect(status.isPenalized).toBeTruthy();
    });

    it('should not be penalized by user', async () => {
        const movie = {
            usersRatings: [
                { userId: 1, rating: 5 },
                { userId: 2, rating: 1 }
            ]
        };
        const user = { id: 1 };
        const status = MoviesUtil.isPenalizedByUser(movie, user);

        expect(status.isPenalized).toBeFalsy();
    });

    it('should not be penalized by user, because user does not exist', async () => {
        const movie = {
            usersRatings: [
                { userId: 1, rating: 0 },
                { userId: 2, rating: 1 }
            ]
        };
        const user = { id: 3 };
        const status = MoviesUtil.isPenalizedByUser(movie, user);

        expect(status.isPenalized).toBeFalsy();
    });
});

describe('getStats', () => {
    let connection: Connection = null;
    let repository: Repository<Movie> = null;

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

    beforeAll(async () => {
        try {
            connection = await createConnection();
            const usersRepository = getRepository(User);
            await usersRepository.save([user, user2]);
            repository = getRepository(Movie);
            await repository.save(movie);
        } catch (error) {
            throw new Error(error.message);
        }
    }, 100000);
    afterAll(async () => {
        try {
            await connection.dropDatabase();
            await connection.close();
        } catch (error) {
            throw new Error(error.message);
        }
    }, 20000);

    it('result should contains stats for movie in database', async () => {
        const movies = [movie];
        const moviesWithStats = await MoviesUtil.getStats(movies);

        expect(moviesWithStats[0]).toHaveProperty('avgRating');
        expect(moviesWithStats[0]).toHaveProperty('ratingsCount');
        expect(moviesWithStats[0]).toHaveProperty('penalized');
    });

    it('movie should be penalized by one rating', async () => {
        const movies = [movie];
        const moviesWithStats = await MoviesUtil.getStats(movies);

        expect(moviesWithStats[0]).toHaveProperty('penalized');
        expect(moviesWithStats[0].penalized).toEqual(1);
    });

    it('number of ratings in stats should match actual number of ratings', async () => {
        const movies = [movie];
        const moviesWithStats = await MoviesUtil.getStats(movies);

        expect(moviesWithStats[0]).toHaveProperty('ratingsCount');
        expect(moviesWithStats[0].ratingsCount).toEqual(movie.usersRatings.length);
    });

    it('average rating in stats should match actual average rating', async () => {
        const movies = [movie];
        const moviesWithStats = await MoviesUtil.getStats(movies);
        const ratingsSum = movie.usersRatings.reduce((value, item) => value + item.rating, 0);

        expect(moviesWithStats[0]).toHaveProperty('avgRating');
        expect(moviesWithStats[0].avgRating).toEqual(ratingsSum / movie.usersRatings.length);
    });
});

describe('getQueriedMoviesRatings', () => {
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });

    it('should return stats for requested movies', async () => {
        const recommenderUrl = config.get('recommenderUrl');
        moxios.stubRequest(`${recommenderUrl}/search/1`, {
            status: 200,
            response: {
                ratings: [
                    { id: 1, rating: 0.5, similarity: 0.05 },
                    { id: 2, rating: 1.5, similarity: 0.15 }
                ]
            }
        });
        const movies = [
            { id: 1 },
            { id: 2 }
        ];
        const user = { id: 1 };
        const moviesWithStats = await MoviesUtil.getQueriedMoviesRatings(movies, user, recommenderUrl);

        expect(moviesWithStats[0]).toHaveProperty('rating');
        expect(moviesWithStats[0]).toHaveProperty('ratedSimilarity');
    });

    it('stats for requested movies should have expected values', async () => {
        const recommenderUrl = config.get('recommenderUrl');
        const stats = [
            { id: 1, rating: 2.5, similarity: 0.05 },
            { id: 2, rating: 1.5, similarity: 0.04 }
        ];
        moxios.stubRequest(`${recommenderUrl}/search/1`, {
            status: 200,
            response: {
                ratings: stats
            }
        });
        const movies = [
            { id: 1 },
            { id: 2 }
        ];
        const user = { id: 1 };
        const moviesWithStats = await MoviesUtil.getQueriedMoviesRatings(movies, user, recommenderUrl);

        expect(moviesWithStats[1]).toHaveProperty('rating');
        expect(moviesWithStats[1]).toHaveProperty('ratedSimilarity');
        expect(moviesWithStats[1].rating).toEqual(stats[1].rating);
        expect(moviesWithStats[1].ratedSimilarity).toEqual(stats[1].similarity);
    });
});
