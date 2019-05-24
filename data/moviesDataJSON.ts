import axios from 'axios';
import * as csv from 'csvtojson';
import * as config from 'config';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';

const progressBar = new cliProgress.Bar({});

csv()
    .fromFile('data/filtered/links.csv')
    .then(async (data) => {
        const movies = [];

        progressBar.start(data.length, 0);
        for (const mov of data) {
            const movie = {
                id: mov.movieId,
                imdbId: mov.imdbId
            };

            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=tt${movie.imdbId}&apikey=${config.get('omdbApiKey')}&plot=full`);
                movie['title'] = response.data.Title;
                movie['genre'] = response.data.Genre;
                movie['content'] = response.data.Plot;
            } catch (error) {
                console.log(error.message);
            }

            movies.push(movie);
            progressBar.increment(1);
        }

        progressBar.stop();
        fs.writeFile('data/output/movies_data.json', JSON.stringify({ data: movies }), 'utf8', () => console.log('Movies writed to JSON'));
    });
