// @ts-ignore
import * as config from 'config';
import * as _ from 'lodash';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { authenticate } from '../middleware/auth';
import axios from 'axios';
import { Movie } from '../entities/Movie';
const router = Router();

router.get('/users/:id', [authenticate], async (req: Request, res: any) => {
    req.socket.setTimeout(3600e3);
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    const id = parseInt(req.params.id, 10);
    const take: any = req.query.take || 10;
    const skip: any = req.query.skip || 0;
    const compareTo: any = req.query.compareTo && req.query.compareTo.length ? req.query.compareTo : null;

    let url = `${recommender}/playground/users/${id}/recommendations?take=${take}&skip=${skip}`;

    if (compareTo) {
        url = `${url}&compareTo=${compareTo}`;
    }

    try {
        const recsResponse = await axios.get(url);
        const { data } = recsResponse;

        if (data && data.length) {
            const moviesIds = data.map(item => item.id);
            const movies = await repository
                .createQueryBuilder('movies')
                .leftJoinAndSelect('movies.genres', 'genres')
                .where('movies.id IN (:ids)', { ids: moviesIds })
                .getMany();

            if (movies && movies.length > 0) {
                const moviesWithData = movies.map((movie) => {
                    const originalRec = data.find(item => item.id === movie.id);

                    return {
                        ...movie,
                        predictedRating: originalRec.rating ?? 0,
                        similarity: originalRec.similarity ?? 0
                    };
                });
                return res.send(_.orderBy(moviesWithData, ['predictedRating'], ['desc']));
            }

            return res.send(data);
        }

        return res.boom.badRequest(`No recommendations for user ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
