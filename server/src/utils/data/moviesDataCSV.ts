import axios from 'axios';
import * as csv from 'csvtojson';
import * as config from 'config';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';

const ws = fs.createWriteStream('server/src/utils/data/movies.dat');

csv()
    .fromFile('server/src/utils/data/links.csv')
    .then(async (linksData) => {
        const movies = [];

        for (const link of linksData) {
            const movie = {
                id: link.imdbId
            };

            console.log(`Getting data for movie with id: ${movie.id}`);

            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=tt${movie.id}&apikey=${config.get('omdbApiKey')}`);
                movie['title'] = response.data.Title;
                movie['year'] = response.data.Year;
                movie['genre'] = response.data.Genre.split(', ').join('|');

                movies.push(movie);
            } catch (error) {
                console.log(error.message);
            }
        }

        fastcsv
            .write(movies, { headers: false, delimiter: ';', quote: null, escape: null })
            .pipe(ws);
    });
