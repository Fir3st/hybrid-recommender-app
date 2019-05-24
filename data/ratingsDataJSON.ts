import * as csv from 'csvtojson';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';

const progressBar = new cliProgress.Bar({});

csv()
    .fromFile('data/filtered/ratings.csv')
    .then((data) => {
        const ratings = [];

        progressBar.start(data.length, 0);
        for (const rating of data) {
            try {
                ratings.push({
                    userId: parseInt(rating.userId, 10),
                    movieId: parseInt(rating.movieId, 10),
                    rating: parseFloat(rating.rating),
                    timestamp: rating.timestamp
                });
                progressBar.increment(1);
            } catch (error) {
                console.log(error.message);
            }
        }

        progressBar.stop();
        fs.writeFile('data/output/ratings_data.json', JSON.stringify({ data: ratings }), 'utf8', () => console.log('Ratings writed to JSON.'));
    });
