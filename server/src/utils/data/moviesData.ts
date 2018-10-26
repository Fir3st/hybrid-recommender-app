import axios from 'axios';
import * as csv from 'csvtojson';
import * as config from 'config';
import * as moment from 'moment';
import { createConnection } from 'typeorm';
import { Movie } from './../../entities/Movie';
import { Genre } from './../../entities/Genre';
import { Actor } from './../../entities/Actor';
import { Language } from './../../entities/Language';
import { Rating } from './../../entities/Rating';

const movies: Movie[] = [];

createConnection().then(async (connection) => {
    csv()
        .fromFile('server/src/utils/data/links.csv')
        .then(async (data) => {
            for (const mov of data) {
                const movie = new Movie();
                movie.id = mov.movieId;
                movie.imdbId = mov.imdbId;

                console.log(`Getting data for movie with id: ${movie.id}`);

                try {
                    const response = await axios.get(`http://www.omdbapi.com/?i=tt${movie.imdbId}&apikey=${config.get('omdbApiKey')}&plot=full`);
                    movie.title = response.data.Title;
                    movie.year = response.data.Year;
                    movie.rating = response.data.Rated;
                    movie.releaseDate = moment(response.data.Released, 'DD MMM YYYY').format('YYYY-MM-DD');

                    const genres = response.data.Genre.split(',').map(item => item.trim());
                    movie.genres = [];
                    for (const item of genres) {
                        let genre = await connection.manager.findOne(
                            Genre,
                            { name: item }
                        );
                        if (genre) {
                            movie.genres.push(genre);
                        } else {
                            genre = new Genre();
                            genre.name = item;
                            movie.genres.push(genre);
                        }
                    }
                    movie.director = response.data.Director;

                    const actors = response.data.Actors.split(',').map(item => item.trim());
                    movie.actors = [];
                    for (const item of actors) {
                        let actor = await connection.manager.findOne(Actor, { name: item });
                        if (actor) {
                            movie.actors.push(actor);
                        } else {
                            actor = new Actor();
                            actor.name = item;
                            movie.actors.push(actor);
                        }
                    }

                    movie.plot = response.data.Plot;

                    const languages = response.data.Language.split(',').map(item => item.trim());
                    movie.languages = [];
                    for (const item of languages) {
                        let language = await connection.manager.findOne(Language, { name: item });
                        if (language) {
                            movie.languages.push(language);
                        } else {
                            language = new Language();
                            language.name = item;
                            movie.languages.push(language);
                        }
                    }

                    movie.country = response.data.Country;
                    movie.poster = response.data.Poster;
                    movie.type = response.data.Type;
                    movie.production = response.data.Production;

                    movie.ratings = response.data.Ratings.map((r) => {
                        const rating = new Rating();
                        rating.source = r.Source;
                        rating.value = r.Value;
                        return rating;
                    });

                    const imdbRating = new Rating();
                    imdbRating.source = 'IMDB';
                    imdbRating.value = response.data.imdbRating;

                    const metascoreRating = new Rating();
                    metascoreRating.source = 'Metascore';
                    metascoreRating.value = response.data.Metascore;

                    movie.ratings.push(imdbRating);
                    movie.ratings.push(metascoreRating);

                    await connection.manager.save(movie);
                } catch (error) {
                    console.log(error.message);
                }
            }
        });
});
