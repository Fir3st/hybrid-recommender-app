import { Movie } from '../../entities/Movie';

export default class MoviesUtil {
    public static updateMovie(receivedMovie: any, movie: Movie): void {
        for (const prop in receivedMovie) {
            if (movie.hasOwnProperty(prop)) {
                movie[prop] = receivedMovie[prop];
            }
        }
    }

    public static transformMovieData(movie: any) {
        return {
            id: movie.movies_id,
            title: movie.movies_title,
            plot: movie.movies_plot,
            poster: movie.movies_poster,
            year: movie.movies_year,
            avgRating: movie.avgRating,
            ratingsCount: movie.ratingsCount
        };
    }
}
