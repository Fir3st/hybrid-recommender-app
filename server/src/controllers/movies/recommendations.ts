// @ts-nocheck
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
    const take = req.query.take || 10;
    const skip = req.query.skip || 0;

    try {
        const url = `${recommender}/movies/${id}/recommendations?take=${take}&skip=${skip}`;

        const recsResponse = await axios.get(url);
        const { recommendations } = recsResponse.data;

        if (recommendations && recommendations.length > 0) {
            const moviesIds = recommendations.map(item => item.id);
            const movies = await repository
                .createQueryBuilder('movies')
                .leftJoinAndSelect('movies.genres', 'genres')
                .where('movies.id IN (:ids)', { ids: moviesIds })
                .getMany();

            if (movies && movies.length > 0) {
                const moviesWithInfo = MoviesUtil.getMoviesInfo(movies, recommendations, 'similarity');
                return res.send(_.orderBy(moviesWithInfo, ['similarity', 'esScore'], ['desc', 'desc']));
            }

            return res.send(recommendations);
        }

        return res.boom.badRequest(`No recommendations for ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
