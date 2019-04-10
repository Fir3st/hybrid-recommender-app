import axios from 'axios';
import * as csv from 'csvtojson';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';

const ws = fs.createWriteStream('server/src/utils/data/movies.dat');

csv()
    .fromFile('server/src/utils/data/movies.csv')
    .then((moviesData) => {

        csv()
            .fromFile('server/src/utils/data/links.csv')
            .then((linksData) => {
                const movies = [];

                for (const link of linksData) {
                    const movie = moviesData.find(item => parseInt(item.movieId, 10) === parseInt(link.movieId, 10));
                    if (movie) {
                        movies.push({
                            id: link.imdbId,
                            title: movie.title,
                            genres: movie.genres
                        });
                    }
                }

                fastcsv
                    .write(movies, { headers: false, delimiter: ';', quote: '', escape: '' })
                    .pipe(ws);
            });
    });
