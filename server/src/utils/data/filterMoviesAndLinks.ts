import axios from 'axios';
import * as csv from 'csvtojson';
import * as config from 'config';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';

const wsMovies = fs.createWriteStream('server/src/utils/data/filtered/movies.csv');
const wsLinks = fs.createWriteStream('server/src/utils/data/filtered/links.csv');

csv()
    .fromFile('server/src/utils/data/original/links.csv')
    .then(async (linksData) => {
        const movies = [];
        const links = [];

        for (const link of linksData) {
            const movie = {
                movieId: link.movieId
            };

            console.log(`Getting data for movie with id: ${movie.movieId}`);

            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=tt${link.imdbId}&apikey=${config.get('omdbApiKey')}`);
                movie['title'] = response.data.Title;
                const genres = response.data.Genre;
                movie['genres'] = genres ? genres.split(',').map(item => item.trim()).join('|') : '';
                const type = response.data.Type === 'movie' ? 'movie' : 'tv';

                const tmdbAddResponse = await axios.get(`https://api.themoviedb.org/3/${type}/${link.tmdbId}?api_key=${config.get('tmdbApiKey')}`);

                links.push(link);
                movies.push(movie);
            } catch (error) {
                console.log(error.message);
            }
        }

        fastcsv
            .write(movies, { headers: true, delimiter: ',' })
            .pipe(wsMovies);

        fastcsv
            .write(links, { headers: true, delimiter: ',' })
            .pipe(wsLinks);
    });
