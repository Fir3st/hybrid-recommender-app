import * as csv from 'csvtojson';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';

const ws = fs.createWriteStream('server/src/utils/data/ratings.dat');

csv()
    .fromFile('server/src/utils/data/links.csv')
    .then(async (data) => {
        return data.map((item) => {
            return {
                id: item.movieId,
                imdbId: item.imdbId
            };
        });
    })
    .then((movies) => {
        csv()
            .fromFile('server/src/utils/data/ratings.csv')
            .then((data) => {
                const ratings = [];

                for (const rating of data) {
                    try {
                        const movie = movies.find(item => parseInt(item.id, 10)  === parseInt(rating.movieId, 10));

                        ratings.push({
                            userId: rating.userId,
                            movieId: movie.imdbId,
                            rating: rating.rating,
                            timestamp: rating.timestamp
                        });
                    } catch (error) {
                        console.log(error.message);
                    }
                }

                fastcsv
                    .write(ratings, { headers: false, delimiter: ';', quote: null })
                    .pipe(ws);
            });
    });
