import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import * as winston from 'winston';
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

export default router;
