import { Movie } from '../../entities/Movie';

export default class MoviesUtil {
    public static updateMovie(receivedMovie: any, movie: Movie): void {
        for (const prop in receivedMovie) {
            if (movie.hasOwnProperty(prop)) {
                movie[prop] = receivedMovie[prop];
            }
        }
    }
}
