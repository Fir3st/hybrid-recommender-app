import MoviesUtil from '../../src/utils/movies/MoviesUtil';

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
