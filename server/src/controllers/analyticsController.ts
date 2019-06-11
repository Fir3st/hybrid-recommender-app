import * as config from 'config';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { UserRating } from '../entities/UserRating';
import { authenticate, authorize } from '../middleware/auth';
import axios from 'axios';
const router = Router();

router.get('/ratings-distribution', [authenticate, authorize], async (req: Request, res: any) => {
    const repository = getRepository(UserRating);

    try {
        const query = repository
            .createQueryBuilder('ratings')
            .select('ratings.rating')
            .addSelect('COUNT(*) as count')
            .groupBy('ratings.rating');

        const ratings = await query.getRawMany();
        if (ratings && ratings.length > 0) {
            return res.send(ratings.map((item) => {
                return {
                    rating: item.ratings_rating,
                    count: parseInt(item.count, 10)
                };
            }));
        }

        return res.boom.badRequest('No ratings found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/similarities-distribution', [authenticate, authorize], async (req: Request, res: any) => {
    const recommender = config.get('recommenderUrl');

    try {
        const recsResponse = await axios.get(`${recommender}/movies/similarities-distribution`);
        const distributions = recsResponse.data;

        if (distributions && distributions.length > 0) {
            return res.send(distributions);
        }

        return res.boom.badRequest('No similarities distribution found');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
