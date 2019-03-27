import { Movie } from '../../entities/Movie';
import { getRepository } from 'typeorm';

export default class MoviesUtil {
    public static getMoviesStats(movies, recommendations, key) {
        const repository = getRepository(Movie);

        return movies.map(async (item) => {
            const rec = recommendations.find(movie => parseInt(movie.id, 10) === parseInt(item.id, 10));
            const movie = {
                ...item
            };
            movie[key] = rec ? parseFloat(rec[key]).toFixed(3) : null;
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
}
