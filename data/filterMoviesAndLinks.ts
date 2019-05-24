import axios from 'axios';
const axiosRetry = require('axios-retry');
import * as csv from 'csvtojson';
import * as config from 'config';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';

const wsMovies = fs.createWriteStream('data/filtered/movies.csv');
const wsLinks = fs.createWriteStream('data/filtered/links.csv');
const progressBar = new cliProgress.Bar({});
axiosRetry(axios, { retries: 100 });

csv()
    .fromFile('data/original/links.csv')
    .then(async (linksData) => {
        const movies = [];
        const links = [];

        progressBar.start(linksData.length, 0);
        for (const link of linksData) {
            const movie = {
                movieId: link.movieId
            };

            try {
                let url = `http://www.omdbapi.com/?i=tt${link.imdbId}&apikey=${config.get('omdbApiKey')}`;
                const response = await axios.get(url);
                movie['title'] = response.data.Title;
                const genres = response.data.Genre;
                movie['genres'] = genres ? genres.split(',').map(item => item.trim()).join('|') : '';

                url = `https://api.themoviedb.org/3/find/tt${link.imdbId}?external_source=imdb_id&api_key=${config.get('tmdbApiKey')}`;
                const tmdbAddResponse = await axios.get(url);
                const { data } = tmdbAddResponse;
                const { movie_results, tv_results } = data;
                if ((movie_results && movie_results.length > 0) || (tv_results && tv_results.length > 0)) {
                    links.push(link);
                    movies.push(movie);
                }
            } catch (error) {
                console.log(error.message);
            }

            progressBar.increment(1);
        }

        progressBar.stop();
        fastcsv
            .write(movies, { headers: true, delimiter: ',' })
            .pipe(wsMovies);
        fastcsv
            .write(links, { headers: true, delimiter: ',' })
            .pipe(wsLinks);
        console.log('Movies filtered');
    });
