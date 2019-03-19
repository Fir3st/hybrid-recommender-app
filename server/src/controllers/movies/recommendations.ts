import axios from 'axios';
import * as _ from 'lodash';
import * as config from 'config';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import winston from '../../utils/winston';
import { Movie } from '../../entities/Movie';
import MoviesUtil from '../../utils/movies/MoviesUtil';

export const getRecommendations = async (req: Request, res: any) => {
    const id = req.params.id;
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    try {
        const recommendations = await axios.get(`${recommender}/movies/${id}/recommendations`);

        if (recommendations && recommendations.data.recommendations && recommendations.data.recommendations.length > 0) {
            const recommendedMovies = recommendations.data.recommendations;
            const moviesIds = recommendedMovies.map(item => item.id);
            const movies = await repository
                .createQueryBuilder('movies')
                .leftJoinAndSelect('movies.usersRatings', 'usersRatings')
                .select([
                    'AVG(usersRatings.rating) AS avgRating',
                    'COUNT(usersRatings.id) AS ratingsCount',
                    'movies.id',
                    'movies.title',
                    'movies.poster',
                    'movies.year',
                    'movies.plot'
                ])
                .groupBy('movies.id')
                .where('movies.id IN (:ids)', { ids: moviesIds })
                .getRawMany();

            if (movies && movies.length > 0) {
                const moviesForRes = movies.map((item) => {
                    const recommendedMovie = recommendedMovies.find(movie => movie.id === item.movies_id);
                    return {
                        ...MoviesUtil.transformMovieData(item),
                        similarity: recommendedMovie ? parseFloat(recommendedMovie.similarity).toFixed(3) : null
                    };
                });
                return res.send(_.orderBy(moviesForRes, ['similarity'], ['desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
