import axios from 'axios';
import * as csv from 'csvtojson';
import * as config from 'config';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';

const progressBar = new cliProgress.Bar({});

const ws = fs.createWriteStream('data/output/movies.dat');

csv()
    .fromFile('data/filtered/links.csv')
    .then(async (linksData) => {
        const movies = [];

        progressBar.start(linksData.length, 0);
        for (const link of linksData) {
            const movie = {
                id: link.imdbId
            };

            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=tt${movie.id}&apikey=${config.get('omdbApiKey')}`);
                movie['title'] = response.data.Title;
                movie['year'] = response.data.Year;
                const genres = response.data.Genre;
                movie['genres'] = genres ? genres.split(',').map(item => item.trim()).join('|') : '';

                movies.push(movie);
                progressBar.increment(1);
            } catch (error) {
                console.log(error.message);
            }
        }

        progressBar.stop();
        fastcsv
            .write(movies, { headers: false, delimiter: ';', quote: null, escape: null })
            .pipe(ws);
        console.log('Movies writed to CSV');
    });
