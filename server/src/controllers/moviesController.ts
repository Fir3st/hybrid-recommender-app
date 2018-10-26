import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import * as winston from 'winston';
import { Movie } from '../entities/Movie';
const router = Router();

router.get('/', async (req: Request, res: any) => {
    const repository = getRepository(Movie);
    try {
        const movies = await repository.find();
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
