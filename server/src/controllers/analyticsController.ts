import * as config from 'config';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { UserRating } from '../entities/UserRating';
import { authenticate, authorize } from '../middleware/auth';
import axios from 'axios';
const router = Router();

router.get('/ratings-values-distribution', [authenticate, authorize], async (req: Request, res: any) => {
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

router.get('/ratings-distribution', [authenticate, authorize], async (req: Request, res: any) => {
    const repository = getRepository(UserRating);

    try {
        const query = repository
            .createQueryBuilder('ratings')
            .select(['ratings.movieId'])
            .addSelect('COUNT(*) as count')
            .groupBy('ratings.movieId');

        let ratings = await query.getRawMany();
        if (ratings && ratings.length > 0) {
            ratings = ratings.map(item => parseInt(item.count, 10));
            const max = Math.max(...ratings);
            const min = Math.min(...ratings);
            const bucketsNum = 100;
            const labels = [];

            for (let i = min; i <= max; i += (max - min) / bucketsNum) {
                labels.push(Math.floor(i));
            }
            labels[labels.length - 1] = labels[labels.length - 1] < max ? max : labels[labels.length - 1];
            labels.shift();
            const buckets = Array(labels.length).fill(0);

            for (const rating of ratings) {
                for (let i = 0; i < labels.length; i += 1) {
                    if (rating <= labels[i]) {
                        buckets[i] += 1;
                        break;
                    }
                }
            }

            const result = [];
            for (let i = 0; i < labels.length; i += 1) {
                result.push({
                    value: labels[i],
                    count: buckets[i]
                });
            }

            return res.send(result);
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
