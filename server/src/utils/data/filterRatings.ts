import * as csv from 'csvtojson';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';

const wsRatings = fs.createWriteStream('server/src/utils/data/filtered/ratings.csv');

csv()
    .fromFile('server/src/utils/data/filtered/movies.csv')
    .then((movies) => {
        csv()
            .fromFile('server/src/utils/data/original/ratings.csv')
            .then((ratingsData) => {
                const ratings = [];

                for (const rating of ratingsData) {
                    const movie = movies.find(item => item.movieId === rating.movieId);

                    if (movie) {
                        ratings.push(rating);
                    }
                }

                fastcsv
                    .write(ratings, { headers: true, delimiter: ',' })
                    .pipe(wsRatings);
            });
    });
