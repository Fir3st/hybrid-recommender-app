import axios from 'axios';
const axiosRetry = require('axios-retry');
import * as csv from 'csvtojson';
import * as config from 'config';
import * as moment from 'moment';
import * as cliProgress from 'cli-progress';
import { createConnection } from 'typeorm';
import { Movie } from '../server/src/entities/Movie';
import { Genre } from '../server/src/entities/Genre';
import { Actor } from '../server/src/entities/Actor';
import { Language } from '../server/src/entities/Language';
import { Rating } from '../server/src/entities/Rating';
import { Country } from '../server/src/entities/Country';

const progressBar = new cliProgress.Bar({});
axiosRetry(axios, { retries: 100 });

createConnection()
    .then(async (connection) => {
        csv()
            .fromFile('data/filtered/links.csv')
            .then(async (data) => {
                progressBar.start(data.length, 0);
                for (const mov of data) {
                    const movie = new Movie();
                    movie.id = mov.movieId;
                    movie.imdbId = mov.imdbId;

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

                        const countries = response.data.Country.split(',').map(item => item.trim());
                        movie.countries = [];
                        for (const item of countries) {
                            let country = await connection.manager.findOne(Country, { name: item });
                            if (country) {
                                movie.countries.push(country);
                            } else {
                                country = new Country();
                                country.name = item;
                                movie.countries.push(country);
                            }
                        }

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

                    progressBar.increment(1);
                }
            }).then(async () => {
                progressBar.stop();
                await connection.close();
                console.log('Movies populated');
            });
    })
    .catch(error => console.log(error));
