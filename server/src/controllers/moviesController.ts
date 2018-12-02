import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import axios from 'axios';
import * as config from 'config';
import winston from '../utils/winston';
import { Movie } from '../entities/Movie';
const router = Router();

router.get('/', async (req: Request, res: any) => {
    const take = req.query.take || 10;
    const skip = req.query.skip || 0;
    const repository = getRepository(Movie);

    try {
        const movies = await repository
            .createQueryBuilder('movies')
            .leftJoinAndSelect('movies.genres', 'genres')
            .leftJoinAndSelect('movies.actors', 'actors')
            .leftJoinAndSelect('movies.languages', 'languages')
            .leftJoinAndSelect('movies.countries', 'countries')
            .leftJoinAndSelect('movies.ratings', 'ratings')
            .take(take)
            .skip(skip)
            .getMany();

        if (movies) {
            return res.send(movies);
        }

        return res.boom.badRequest('No movies found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:id', async (req: Request, res: any) => {
    const id = req.params.id;
    const repository = getRepository(Movie);

    try {
        const movie = await repository
            .createQueryBuilder('movie')
            .leftJoinAndSelect('movie.genres', 'genres')
            .leftJoinAndSelect('movie.actors', 'actors')
            .leftJoinAndSelect('movie.languages', 'languages')
            .leftJoinAndSelect('movie.countries', 'countries')
            .leftJoinAndSelect('movie.ratings', 'ratings')
            .where('movie.id = :id', { id })
            .getOne();

        if (movie) {
            return res.send(movie);
        }

        return res.boom.badRequest(`Movie with id ${id} not found.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:id/recommendations', async (req: Request, res: any) => {
    const id = req.params.id;
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    try {
        const recommendations = await axios.get(`${recommender}/movies/${id}/recommendations`);

        if (recommendations && recommendations.data.recommendations && recommendations.data.recommendations.length > 0) {
            const moviesIds = recommendations.data.recommendations.map(item => item.id);
            const movies = await repository
                .createQueryBuilder('movies')
                .where('movies.id IN (:ids)', { ids: moviesIds })
                .select(['movies.id', 'movies.title', 'movies.poster', 'movies.type'])
                .getMany();

            if (movies && movies.length > 0) {
                return res.send(movies);
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for ${id}`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
