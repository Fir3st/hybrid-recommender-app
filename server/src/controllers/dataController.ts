import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import * as _ from 'lodash';
import winston from '../utils/winston';
import { Movie } from '../entities/Movie';
import { User } from '../entities/User';
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
                'COUNT(usersRatings.id) AS ratingsCount',
                'SUM(CASE WHEN usersRatings.rating = 0 THEN 1 ELSE 0 END) AS penalized'
            ])
            .groupBy('movies.id');

        const movies = await query.getRawMany();
        if (movies && movies.length > 0) {
            const data = movies.map((item) => {
                return {
                    id: item.movies_id,
                    title: item.movies_title,
                    average_rating: item.avgRating,
                    count: parseInt(item.ratingsCount, 10),
                    penalized: parseInt(item.penalized, 10)
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

router.get('/users', async (req: Request, res: any) => {
    const repository = getRepository(Movie);
    const usersRepository = getRepository(User);

    try {
        const users = await usersRepository
            .createQueryBuilder('users')
            .orderBy('users.id', 'ASC')
            .getMany();

        if (users && users.length) {
            const response = [];

            for (const user of users) {
                const genres = {};
                const movies = await repository
                    .createQueryBuilder('movie')
                    .leftJoinAndSelect('movie.usersRatings', 'ratings')
                    .leftJoinAndSelect('movie.genres', 'genres')
                    .where('ratings.userId = :id', { id: user.id })
                    .getMany();

                if (movies && movies.length > 0) {
                    for (const movie of movies) {
                        for (const genre of movie.genres) {
                            if (genres[genre.name]) {
                                genres[genre.name].count += 1;
                                genres[genre.name].value += movie.usersRatings[0].rating;
                            } else {
                                genres[genre.name] = {
                                    count: 1,
                                    value: movie.usersRatings[0].rating
                                };
                            }
                        }
                    }

                    const orderedGenres = _.orderBy(Object.keys(genres).map((name) => ({
                        name,
                        ...genres[name],
                    })), ['count'], ['desc']);
        
                    response.push({
                        user: user.id,
                        genres: _.take(orderedGenres, 3).map((genre: any) => ({
                            avg: (genre.value / genre.count).toFixed(2),
                            ...genre,
                        })),
                    })
                }
            }

            return res.send(response);
        }

        return res.boom.badRequest('No users found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
