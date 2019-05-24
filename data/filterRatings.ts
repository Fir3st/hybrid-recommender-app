import * as csv from 'csvtojson';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';

const wsRatings = fs.createWriteStream('data/filtered/ratings.csv');
const progressBar = new cliProgress.Bar({});

csv()
    .fromFile('data/filtered/movies.csv')
    .then((movies) => {
        csv()
            .fromFile('data/original/ratings.csv')
            .then((ratingsData) => {
                const ratings = [];

                progressBar.start(ratingsData.length, 0);
                for (const rating of ratingsData) {
                    const movie = movies.find(item => item.movieId === rating.movieId);

                    if (movie) {
                        ratings.push(rating);
                    }

                    progressBar.increment(1);
                }

                progressBar.stop();
                fastcsv
                    .write(ratings, { headers: true, delimiter: ',' })
                    .pipe(wsRatings);
                console.log('Ratings filtered');
            });
    });
