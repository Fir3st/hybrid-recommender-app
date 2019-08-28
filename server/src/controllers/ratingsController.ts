import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { UserRating } from '../entities/UserRating';
import { authenticate, authorize } from '../middleware/auth';
const router = Router();

router.get('/', [authenticate, authorize], async (req: Request, res: any) => {
    const repository = getRepository(UserRating);

    try {
        const query = repository
            .createQueryBuilder('ratings');

        const ratings = await query.getMany();
        if (ratings && ratings.length > 0) {
            return res.send(ratings);
        }

        return res.boom.badRequest('No ratings found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/count', async (req: Request, res: any) => {
    const repository = getRepository(UserRating);

    try {
        const query = repository
            .createQueryBuilder('ratings');

        const ratingsCount = await query.getCount();
        if (ratingsCount) {
            return res.send({ count: ratingsCount });
        }

        return res.boom.badRequest('No ratings found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
