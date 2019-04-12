import * as csv from 'csvtojson';
import * as fs from 'fs';

csv()
    .fromFile('server/src/utils/data/filtered/ratings.csv')
    .then((data) => {
        const ratings = [];

        for (const rating of data) {
            try {
                ratings.push({
                    userId: parseInt(rating.userId, 10),
                    movieId: parseInt(rating.movieId, 10),
                    rating: parseFloat(rating.rating),
                    timestamp: rating.timestamp
                });
            } catch (error) {
                console.log(error.message);
            }
        }

        fs.writeFile('server/src/utils/data/output/ratings_data.json', JSON.stringify({ data: ratings }), 'utf8', () => console.log('Done.'));
    });
