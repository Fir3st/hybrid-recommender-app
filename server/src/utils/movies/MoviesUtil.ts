import { Movie } from '../../entities/Movie';
import {getRepository} from "typeorm";

export default class MoviesUtil {
    public static transformMovieData(movie: any) {
        return {
            id: parseInt(movie.movies_id, 10),
            title: movie.movies_title,
            plot: movie.movies_plot,
            poster: movie.movies_poster,
            year: movie.movies_year,
            avgRating: movie.avgRating,
            ratingsCount: movie.ratingsCount
        };
    }
    public static getMoviesStats(movies, recommendations, key) {
        const repository = getRepository(Movie);

        return movies.map(async (item) => {
            const rec = recommendations.find(movie => movie.id === item.id);
            const movie = {
                ...item
            };
            movie[key] = rec ? parseFloat(rec.similarity).toFixed(3) : null;
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
