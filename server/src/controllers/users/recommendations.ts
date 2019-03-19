import axios from 'axios';
import * as _ from 'lodash';
import * as config from 'config';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import { Movie } from '../../entities/Movie';
import MoviesUtil from '../../utils/movies/MoviesUtil';
import winston from '../../utils/winston';

export const getRecommendations = async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    try {
        const recommendations = await axios.get(`${recommender}/users/${id}/recommendations`);

        if (recommendations && recommendations.data.recommendations && recommendations.data.recommendations.length > 0) {
            const moviesIds = recommendations.data.recommendations.map(item => item.id);
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
                    const recommendedMovie = recommendations.data.recommendations.find(movie => parseInt(movie.id, 10) === parseInt(item.movies_id, 10));
                    return {
                        ...MoviesUtil.transformMovieData(item),
                        rating: recommendedMovie ? parseFloat(recommendedMovie.rating).toFixed(3) : null
                    };
                });
                return res.send(_.orderBy(moviesForRes, ['rating'], ['desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for user ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const getHybridRecommendations = async (req: Request, res: any) => {
    const userId = parseInt(req.params.userId, 10);
    const movieId = parseInt(req.params.movieId, 10);
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    try {
        const recommendations = await axios.get(`${recommender}/recommendations/${userId}/${movieId}`);

        if (recommendations && recommendations.data.recommendations && recommendations.data.recommendations.length > 0) {
            const moviesIds = recommendations.data.recommendations.map(item => item.id);
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
                    const recommendedMovie = recommendations.data.recommendations.find(movie => parseInt(movie.id, 10) === item.movies_id);
                    const result: any = {
                        ...MoviesUtil.transformMovieData(item)
                    };
                    if ('rating' in recommendedMovie) {
                        result['rating'] = recommendedMovie ? parseFloat(recommendedMovie.rating).toFixed(3) : null;
                    }
                    if ('similarity' in recommendedMovie) {
                        result['similarity'] = recommendedMovie ? parseFloat(recommendedMovie.similarity).toFixed(3) : null;
                    }
                    return result;
                });

                return res.send(_.orderBy(moviesForRes, ['similarity', 'rating'], ['desc', 'desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for user ${userId} and movie ${movieId}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
