import axios from 'axios';
import * as csv from 'csvtojson';
import * as fastcsv from 'fast-csv';
import * as config from 'config';
import * as fs from 'fs';

const ws = fs.createWriteStream('server/src/utils/data/movies.dat');

csv()
    .fromFile('server/src/utils/data/links.csv')
    .then(async (data) => {
        const movies = [];

        for (const mov of data) {
            const movie = {
                id: mov.imdbId
            };

            console.log(`Getting data for movie with id: ${movie.id}`);

            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=tt${movie.id}&apikey=${config.get('omdbApiKey')}&plot=full`);
                movie['title'] = `${response.data.Title} (${response.data.Year})`;
                movie['genre'] = response.data.Genre.split(',').map(item => item.trim()).join('|');
            } catch (error) {
                console.log(error.message);
            }

            movies.push(movie);
        }

        fastcsv
            .write(movies, { headers: false, delimiter: '::', quote: null })
            .pipe(ws);
    });
