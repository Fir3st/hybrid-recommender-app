import axios from 'axios';
import * as _ from 'lodash';
import { Movie } from '../../entities/Movie';
import { getRepository } from 'typeorm';

export default class MoviesUtil {
    public static getMoviesStats(movies, recommendations = [], key = null) {
        const repository = getRepository(Movie);

        return movies.map(async (item) => {
            const rec = recommendations.find(movie => parseInt(movie.id, 10) === parseInt(item.id, 10));
            const movie = {
                ...item
            };
            movie[key] = (rec && key) ? parseFloat(rec[key]).toFixed(3) : null;
            const stats = await repository
                .createQueryBuilder('movie')
                .leftJoinAndSelect('movie.usersRatings', 'usersRatings')
                .select([
                    'AVG(usersRatings.rating) AS avgRating',
                    'COUNT(usersRatings.id) AS ratingsCount',
                    'movie.id'
                ])
                .groupBy('movie.id')
                .where('movie.id = :id', { id: item.id })
                .getRawOne();

            if (stats) {
                movie['avgRating'] = stats.avgRating;
                movie['ratingsCount'] = stats.ratingsCount;
            }

            return movie;
        });
    }

    public static async getQueriedMoviesRatings(movies, user, recommenderUrl) {
        const ratingsResponse = await axios.post(`${recommenderUrl}/search/${user.id}`, { movies: movies.map(item => item.id) });
        const { ratings } = ratingsResponse.data;
        if (ratings && ratings.length > 0) {
            const moviesWithRatings = movies.map((movie) => {
                const rating = ratings.find(item => item.id === movie.id);
                return { ...movie, rating: rating.rating };
            });

            return _.orderBy(moviesWithRatings, ['rating'], ['desc']);
        }

        return movies;
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
}
