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
        const recsResponse = await axios.get(`${recommender}/users/${id}/recommendations`);
        const { recommendations } = recsResponse.data;

        if (recommendations && recommendations.length > 0) {
            const moviesIds = recommendations.map(item => item.id);
            const movies = await repository
                .createQueryBuilder('movies')
                .leftJoinAndSelect('movies.genres', 'genres')
                .where('movies.id IN (:ids)', { ids: moviesIds })
                .getMany();

            if (movies && movies.length > 0) {
                const moviesForRes = MoviesUtil.getMoviesStats(movies, recommendations, 'rating');
                return res.send(_.orderBy(await Promise.all(moviesForRes), ['rating'], ['desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for user ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const getRecommendationsByGenre = async (req: Request, res: any) => {
    const userId = parseInt(req.params.userId, 10);
    const genreId = parseInt(req.params.genreId, 10);
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    try {
        const recsResponse = await axios.get(`${recommender}/users/${userId}/${genreId}/recommendations`);
        const { recommendations } = recsResponse.data;

        if (recommendations && recommendations.length > 0) {
            const moviesIds = recommendations.map(item => item.id);
            const movies = await repository
                .createQueryBuilder('movies')
                .where('movies.id IN (:ids)', { ids: moviesIds })
                .getMany();

            if (movies && movies.length > 0) {
                const moviesForRes = MoviesUtil.getMoviesStats(movies, recommendations, 'rating');
                return res.send(_.orderBy(await Promise.all(moviesForRes), ['rating'], ['desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for user ${userId} and genre ${genreId}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
