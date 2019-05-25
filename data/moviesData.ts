import axios from 'axios';
const axiosRetry = require('axios-retry');
import * as csv from 'csvtojson';
import * as config from 'config';
import * as moment from 'moment';
import * as cliProgress from 'cli-progress';
import { createConnection } from 'typeorm';
import { getGenres, getActors, getCountries, getLanguages } from './utils/movies';
import { Movie } from '../server/src/entities/Movie';
import { Rating } from '../server/src/entities/Rating';

const progressBar = new cliProgress.Bar({});
axiosRetry(axios, { retries: 100 });

createConnection()
    .then(async (connection) => {
        csv()
            .fromFile('data/filtered/links.csv')
            .then(async (data) => {

                progressBar.start(data.length, 0);
                for (const mov of data) {
                    try {
                        let movie = await connection.manager.findOne(Movie, mov.movieId);

                        if (!movie) {
                            movie = new Movie();
                            movie.id = mov.movieId;
                            movie.imdbId = mov.imdbId;

                            const response = await axios.get(`http://www.omdbapi.com/?i=tt${movie.imdbId}&apikey=${config.get('omdbApiKey')}&plot=full`);
                            const { data } = response;

                            movie.title = data.Title;
                            movie.year = data.Year;
                            movie.rating = data.Rated;
                            movie.releaseDate = moment(data.Released, 'DD MMM YYYY').format('YYYY-MM-DD');

                            movie.genres = await getGenres(data, connection);
                            movie.director = data.Director;
                            movie.actors = await getActors(data, connection);
                            movie.plot = data.Plot;
                            movie.languages = await getLanguages(data, connection);
                            movie.countries = await getCountries(data, connection);
                            movie.poster = data.Poster;
                            movie.type = data.Type;
                            movie.production = data.Production;

                            movie.ratings = data.Ratings.map((r) => {
                                const rating = new Rating();
                                rating.source = r.Source;
                                rating.value = r.Value;
                                return rating;
                            });

                            const imdbRating = new Rating();
                            imdbRating.source = 'IMDB';
                            imdbRating.value = data.imdbRating;

                            const metascoreRating = new Rating();
                            metascoreRating.source = 'Metascore';
                            metascoreRating.value = data.Metascore;

                            movie.ratings.push(imdbRating);
                            movie.ratings.push(metascoreRating);

                            await connection.manager.save(movie);
                        }
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
