import axios from 'axios';
import * as _ from 'lodash';
import { Movie } from '../../entities/Movie';
import { getRepository } from 'typeorm';

export default class MoviesUtil {
    public static getMoviesInfo(movies, recommendations = [], key = null) {
        return movies.map((item) => {
            const rec = MoviesUtil.getItemFromRecs(item.id, recommendations);
            let movie = {
                ...item
            };
            if (key) {
                movie[key] = (rec && key) ? rec[key] : null;
            }
            if (key && key === 'rating' && rec && 'similarity' in rec) {
                movie['ratedSimilarity'] = rec.similarity;
            }
            const stats = MoviesUtil.getStatsFromRec(rec);

            if (stats) {
                movie = {
                    ...movie,
                    ...stats
                };
            }

            return movie;
        });
    }

    public static async getQueriedMoviesRatings(movies, user, recommenderUrl) {
        try {
            const ratingsResponse = await axios.post(`${recommenderUrl}/search/${user.id}`, { movies: movies.map(item => item.id) });
            const { ratings } = ratingsResponse.data;
            if (ratings && ratings.length > 0) {
                const moviesWithRatings = movies.map((movie) => {
                    const rating = ratings.find(item => item.id === movie.id);
                    return { ...movie, rating: rating.rating, ratedSimilarity: rating.similarity };
                });

                return _.orderBy(moviesWithRatings, ['rating'], ['desc']);
            }

            return movies;
        } catch (error) {
            console.log(error.message);
        }
    }

    public static isPenalizedByUser(movie, user) {
        let isPenalized = false;
        for (const rating of movie.usersRatings) {
            if (rating.userId === user.id && rating.rating === 0) {
                isPenalized = true;
                break;
            }
        }

        return {
            ..._.omit(movie, ['usersRatings']),
            isPenalized
        };
    }

    public static getItemFromRecs(movieId, recommendations) {
        return recommendations.find(movie => parseInt(movie.id, 10) === parseInt(movieId, 10));
    }

    public static async getStats(movies) {
        const ids = movies.map(item => item.id);
        const repository = getRepository(Movie);
        const result = [];

        const stats = await repository
            .createQueryBuilder('movies')
            .leftJoinAndSelect('movies.usersRatings', 'usersRatings')
            .select([
                'movies.id',
                'AVG(usersRatings.rating) AS avgRating',
                'COUNT(usersRatings.id) AS ratingsCount',
                'SUM(CASE WHEN usersRatings.rating = 0 THEN 1 ELSE 0 END) AS penalized'
            ])
            .groupBy('movies.id')
            .where('movies.id IN (:ids)', { ids })
            .getRawMany();

        if (stats && stats.length > 0) {
            for (const movie of movies) {
                const movieStats = stats.find(item => item.movies_id === parseInt(movie.id, 10));
                movie['avgRating'] = movieStats.avgRating;
                movie['ratingsCount'] = parseInt(movieStats.ratingsCount, 10);
                movie['penalized'] = parseInt(movieStats.penalized, 10);

                result.push(movie);
            }

            return result;
        }

        return movies;
    }

    public static getStatsFromRec(item) {
        const avgRating = item['average_rating'] || null;
        const ratingsCount = item['ratings_count'] || 0;
        const penalized = item['penalized'] || 0;

        return {
            avgRating,
            ratingsCount,
            penalized
        };
    }
}
