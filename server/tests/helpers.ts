import * as bcrypt from 'bcrypt';
import { Genre } from '../src/entities/Genre';
import { User } from '../src/entities/User';
import { Movie } from '../src/entities/Movie';
import { UserRating } from '../src/entities/UserRating';

const genre = new Genre();
genre.name = 'Animation';

const genre2 = new Genre();
genre2.name = 'Horror';

const user = new User();
user.name = 'Test';
user.surname = 'Test';
user.email = 'test@test.co';
user.password = bcrypt.hashSync('secret', 10);
user.admin = true;

const user2 = new User();
user2.name = 'Test2';
user2.surname = 'Test2';
user2.email = 'test2@test.co';
user2.password = bcrypt.hashSync('secret', 10);

const movie = new Movie();
movie.imdbId = 'tt0001';
movie.title = 'Test movie';
movie.year = new Date().getFullYear();
movie.rating = 'PG-13';
movie.releaseDate = new Date().toString();
movie.genres = [];
movie.director = 'John Smith';
movie.plot = 'Some interesting plot';
movie.poster = 'some poster link';
movie.type = 'movie';
movie.production = 'Some production name';
movie.usersRatings = [];

const movie2 = new Movie();
movie2.imdbId = 'tt0001';
movie2.title = 'Test movie 2';
movie2.year = new Date().getFullYear();
movie2.rating = 'PG-13';
movie2.releaseDate = new Date().toString();
movie2.genres = [];
movie2.director = 'John Smith';
movie2.plot = 'Some interesting plot';
movie2.poster = 'some poster link';
movie2.type = 'movie';
movie2.production = 'Some production name';
movie2.usersRatings = [];

const userRating = new UserRating();
userRating.user = user;
userRating.rating = 1;
userRating.createdAt = new Date().toString();

const userRating2 = new UserRating();
userRating2.user = user2;
userRating2.rating = 0;
userRating2.createdAt = new Date().toString();

export {
    genre,
    genre2,
    user,
    user2,
    movie,
    movie2,
    userRating,
    userRating2
};
