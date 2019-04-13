import axios from 'axios';
import * as csv from 'csvtojson';
import * as config from 'config';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';

const ws = fs.createWriteStream('server/src/utils/data/filtered/keywords.csv');

csv()
    .fromFile('server/src/utils/data/filtered/links.csv')
    .then(async (linksData) => {
        const movies = [];

        for (const link of linksData) {
            const movie = {
                id: link.tmdbId
            };

            console.log(`Getting data for movie with id: ${movie.id}`);

            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=tt${link.imdbId}&apikey=${config.get('omdbApiKey')}`);
                const type = response.data.Type === 'movie' ? 'movie' : 'tv';

                const tmdbAddResponse = await axios.get(`https://api.themoviedb.org/3/${type}/${link.tmdbId}/keywords?api_key=${config.get('tmdbApiKey')}`);

                const keywords = tmdbAddResponse.data['keywords'];
                movie['keywords'] = keywords ? JSON.stringify(keywords).replace(/"/g, '\'') : '[]';

                movies.push(movie);
            } catch (error) {
                console.log(error.message);
            }
        }

        fastcsv
            .write(movies, { headers: true, delimiter: ',' })
            .pipe(ws);
    });
