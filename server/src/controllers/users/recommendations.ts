// @ts-nocheck
import axios from 'axios';
import * as _ from 'lodash';
import * as config from 'config';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import { Movie } from '../../entities/Movie';
import MoviesUtil from '../../utils/movies/MoviesUtil';
import UsersUtil from '../../utils/users/UsersUtil';
import winston from '../../utils/winston';
import {not} from "joi";

export const getRecommendations = async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);
    const genres: any = req.query.genres;
    const take = req.query.take || 10;
    const skip = req.query.skip || 0;
    const recommender = config.get('recommenderUrl');
    const orderBy = config.get('CFOrderBy');
    const includeGenres = config.get('includeGenres');
    const repository = getRepository(Movie);
    let url = `${recommender}/users/${id}/recommendations?take=${take}&skip=${skip}&order_by=${orderBy}`;
    if (genres && genres.split(',').length > 0) {
        url = `${url}&genres=${genres}`;
    }

    try {
        if (includeGenres) {
            const { favGenres, notFavGenres } = await UsersUtil.getUserGenres(id);
            if (favGenres.length > 0) {
                url = `${url}&fav_genres=${favGenres.join(',')}`;
            }
            if (notFavGenres.length > 0) {
                url = `${url}&not_fav_genres=${notFavGenres.join(',')}`;
            }
        }
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
                const orderByColumns = orderBy.split(',');
                const index = orderByColumns.indexOf('augmented_rating');
                if (index !== -1) orderByColumns[index] = 'augmentedRating';
                return res.send(_.orderBy(moviesWithInfo, orderByColumns, Array(orderByColumns.length).fill('desc')));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for user ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
