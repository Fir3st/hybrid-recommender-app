import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { Movie } from '../entities/Movie';
const router = Router();

router.get('/movies', async (req: Request, res: any) => {
    const repository = getRepository(Movie);

    try {
        const query = repository
            .createQueryBuilder('movies')
            .leftJoinAndSelect('movies.usersRatings', 'usersRatings')
            .select([
                'movies.id',
                'movies.title',
                'AVG(usersRatings.rating) AS avgRating',
                'COUNT(usersRatings.id) AS ratingsCount'
            ])
            .groupBy('movies.id');

        const movies = await query.getRawMany();
        if (movies && movies.length > 0) {
            const data = movies.map((item) => {
                return {
                    id: item.movies_id,
                    title: item.movies_title,
                    average_rating: item.avgRating,
                    count: parseInt(item.ratingsCount, 10)
                };
            });

            return res.send(data);
        }

        return res.boom.badRequest('No movies found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
