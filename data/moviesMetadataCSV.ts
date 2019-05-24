import axios from 'axios';
import * as csv from 'csvtojson';
import * as config from 'config';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';

const ws = fs.createWriteStream('data/filtered/movies_metadata.csv');
const progressBar = new cliProgress.Bar({});

csv()
    .fromFile('data/filtered/links.csv')
    .then(async (linksData) => {
        const movies = [];

        progressBar.start(linksData.length, 0);
        for (const link of linksData) {
            const movie = {
                id: link.movieId,
                imdb_id: `tt${link.imdbId}`
            };

            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=${movie.imdb_id}&apikey=${config.get('omdbApiKey')}&plot=full`);
                movie['title'] = response.data.Title.replace(/"/g, '\'');
                movie['overview'] = response.data.Plot.replace(/"/g, '\'');
                movie['poster_path'] = response.data.Poster;
                const type = response.data.Type === 'movie' ? 'movie' : 'tv';

                const tmdbAddResponse = await axios.get(`https://api.themoviedb.org/3/${type}/${link.tmdbId}?api_key=${config.get('tmdbApiKey')}`);

                movie['vote_count'] = tmdbAddResponse.data['vote_count'];
                movie['vote_average'] = tmdbAddResponse.data['vote_average'];
                movie['original_title'] = tmdbAddResponse.data['original_title'];
                movie['popularity'] = tmdbAddResponse.data['popularity'];
                movie['original_language'] = tmdbAddResponse.data['original_language'];
                movie['adult'] = tmdbAddResponse.data['adult'] ? 'True' : 'False';
                const collection = tmdbAddResponse.data['belongs_to_collection'];
                movie['belongs_to_collection'] = collection ? JSON.stringify(collection).replace(/"/g, '\'') : '[]';
                movie['budget'] = tmdbAddResponse.data['budget'];
                const genres = tmdbAddResponse.data['genres'];
                movie['genres'] = genres ? JSON.stringify(genres).replace(/"/g, '\'') : '[]';
                movie['homepage'] = tmdbAddResponse.data['homepage'];
                const companies = tmdbAddResponse.data['production_companies'];
                movie['production_companies'] = companies ? JSON.stringify(companies).replace(/"/g, '\'') : '[]';
                const countries = tmdbAddResponse.data['production_countries'];
                movie['production_countries'] = countries ? JSON.stringify(countries).replace(/"/g, '\'') : '[]';
                movie['release_date'] = tmdbAddResponse.data['release_date'];
                movie['revenue'] = tmdbAddResponse.data['revenue'];
                movie['runtime'] = tmdbAddResponse.data['runtime'];
                const languages = tmdbAddResponse.data['spoken_languages'];
                movie['spoken_languages'] = languages ? JSON.stringify(languages).replace(/"/g, '\'') : '[]';
                movie['status'] = tmdbAddResponse.data['status'];
                movie['tagline'] = tmdbAddResponse.data['tagline'];
                movie['video'] = tmdbAddResponse.data['video'];

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
        console.log('Metadata downloaded');
    });
