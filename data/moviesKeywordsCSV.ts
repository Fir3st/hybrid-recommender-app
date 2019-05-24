import axios from 'axios';
import * as csv from 'csvtojson';
import * as config from 'config';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';

const ws = fs.createWriteStream('data/filtered/keywords.csv');
const progressBar = new cliProgress.Bar({});

csv()
    .fromFile('data/filtered/links.csv')
    .then(async (linksData) => {
        const movies = [];

        progressBar.start(linksData.length, 0);
        for (const link of linksData) {
            const movie = {
                id: link.tmdbId
            };

            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=tt${link.imdbId}&apikey=${config.get('omdbApiKey')}`);
                const type = response.data.Type === 'movie' ? 'movie' : 'tv';

                const tmdbAddResponse = await axios.get(`https://api.themoviedb.org/3/${type}/${link.tmdbId}/keywords?api_key=${config.get('tmdbApiKey')}`);

                const keywords = tmdbAddResponse.data['keywords'];
                movie['keywords'] = keywords ? JSON.stringify(keywords).replace(/"/g, '\'') : '[]';

                movies.push(movie);
                progressBar.increment(1);
            } catch (error) {
                console.log(error.message);
            }
        }

        progressBar.stop();
        fastcsv
            .write(movies, { headers: true, delimiter: ',' })
            .pipe(ws);
        console.log('Keywords downloaded');
    });
