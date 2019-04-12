import axios from 'axios';
import * as csv from 'csvtojson';
import * as config from 'config';
import * as fs from 'fs';

csv()
    .fromFile('server/src/utils/data/filtered/links.csv')
    .then(async (data) => {
        const movies = [];

        for (const mov of data) {
            const movie = {
                id: mov.movieId,
                imdbId: mov.imdbId
            };

            console.log(`Getting data for movie with id: ${movie.id}`);

            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=tt${movie.imdbId}&apikey=${config.get('omdbApiKey')}&plot=full`);
                movie['title'] = response.data.Title;
                movie['genre'] = response.data.Genre;
                movie['content'] = response.data.Plot;
            } catch (error) {
                console.log(error.message);
            }

            movies.push(movie);
        }

        fs.writeFile('server/src/utils/data/output/movies_data.json', JSON.stringify({ data: movies }), 'utf8', () => console.log('Done.'));
    });
