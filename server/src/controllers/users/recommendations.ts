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
    const genres = req.query.genres;
    const take = req.query.take || 10;
    const skip = req.query.skip || 0;
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);
    let url = `${recommender}/users/${id}/recommendations?take=${take}&skip=${skip}`;
    if (genres && genres.split(',').length > 0) {
        url = `${url}&genres=${genres}`;
    }

    try {
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
                const moviesWithInfo = MoviesUtil.getMoviesInfo(movies, recommendations, 'rating');
                return res.send(_.orderBy(moviesWithInfo, ['rating'], ['desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for user ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
