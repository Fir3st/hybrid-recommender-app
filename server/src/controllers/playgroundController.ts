import * as config from 'config';
import * as _ from 'lodash';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { authenticate, authorize } from '../middleware/auth';
import axios from 'axios';
import { Movie } from '../entities/Movie';
import MoviesUtil from '../utils/movies/MoviesUtil';
const router = Router();

router.get('/movies/:id', [authenticate, authorize], async (req: Request, res: any) => {
    const id = req.params.id;
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);
    const take = req.query.take || 10;
    const skip = req.query.skip || 0;
    const type = req.query.type || null;

    try {
        let url = `${recommender}/movies-playground/${id}?take=${take}&skip=${skip}`;

        if (type) {
            url = `${url}&type=${type}`;
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
                const moviesWithInfo = MoviesUtil.getMoviesInfo(movies, recommendations, 'similarity');
                return res.send(_.orderBy(moviesWithInfo, ['similarity'], ['desc']));
            }

            return res.send(recommendations);
        }

        return res.boom.badRequest(`No recommendations for ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/users/:id', [authenticate, authorize], async (req: Request, res: any) => {
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    const id = parseInt(req.params.id, 10);
    const genres = req.query.genres ? req.query.genres.split(',').map(item => parseInt(item, 10)) : [];
    const type = req.query.type || 'all';
    const take = req.query.take || 10;
    const skip = req.query.skip || 0;
    const recommenderType = req.query.rec_type || null;
    const similarityType = req.query.sim_type || null;
    const similaritySource = req.query.sim_source || null;

    let url = `${recommender}/users-playground/${id}?take=${take}&skip=${skip}`;

    if (genres && genres.length > 0) {
        url = `${url}&genres=${genres}`;
    }

    if (type !== 'all') {
        url = `${url}&type=${type}`;
    }

    if (recommenderType) {
        url = `${url}&rec_type=${recommenderType}`;
    }

    if (similarityType) {
        url = `${url}&sim_type=${similarityType}`;
    }

    if (similaritySource) {
        url = `${url}&sim_source=${similaritySource}`;
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
});

router.get('/hybrid/:userId/:movieId', [authenticate, authorize], async (req: Request, res: any) => {
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    const userId = parseInt(req.params.userId, 10);
    const movieId = parseInt(req.params.movieId, 10);
    const genres = req.query.genres ? req.query.genres.split(',').map(item => parseInt(item, 10)) : [];
    const type = req.query.type || 'all';
    const take = req.query.take || 10;
    const skip = req.query.skip || 0;
    const recommenderType = req.query.rec_type || null;
    const hybridType = req.query.hybrid_type || null;
    const similarityType = req.query.sim_type || null;
    const similaritySource = req.query.sim_source || null;

    let url = `${recommender}/hybrid-playground/${userId}/${movieId}?take=${take}&skip=${skip}`;

    if (genres && genres.length > 0) {
        url = `${url}&genres=${genres}`;
    }

    if (type !== 'all') {
        url = `${url}&type=${type}`;
    }

    if (hybridType) {
        url = `${url}&hybrid_type=${hybridType}`;
    }

    if (recommenderType) {
        url = `${url}&rec_type=${recommenderType}`;
    }

    if (similarityType) {
        url = `${url}&sim_type=${similarityType}`;
    }

    if (similaritySource) {
        url = `${url}&sim_source=${similaritySource}`;
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
                const moviesWithInfo = MoviesUtil.getMoviesInfo(movies, recommendations, 'both');
                return res.send(_.orderBy(moviesWithInfo, ['recType', 'similarity', 'rating'], ['asc', 'desc', 'desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for user ${userId} and movie ${movieId}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
