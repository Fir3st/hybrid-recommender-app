import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { Movie } from '../entities/Movie';
import { User } from '../entities/User';
import { Genre } from '../entities/Genre';
import { TopGenre } from '../entities/TopGenre';
import { saveTopGenres } from '../utils/genres/topGenres';
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
    const genresRepository = getRepository(Genre);

    try {
        const users = await usersRepository
            .createQueryBuilder('users')
            .orderBy('users.id', 'ASC')
            .getMany();

        if (users && users.length) {
            const response = [];

            for (const user of users) {
                const genres = {};
                const availableGenres = await genresRepository
                    .createQueryBuilder('genres')
                    .where('genres.name <> "N/A"')
                    .getMany();

                for (const genre of availableGenres) {
                    genres[genre.name] = {
                        count: 0,
                        value: 0
                    };
                }

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
                            }
                        }
                    }

                    response.push({
                        user: user.id,
                        genres: Object.keys(genres).map((name) => {
                            const avg: Number = (genres[name].value && genres[name].count) ? genres[name].value / genres[name].count : 0;
                            return {
                                name,
                                ...genres[name],
                                avg: avg.toFixed(2)
                            };
                        })
                    });
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

router.get('/users-top-genres', async (req: Request, res: any) => {
    const repository = getRepository(Movie);
    const usersRepository = getRepository(User);
    const genresRepository = getRepository(Genre);
    const topGenresRepository = getRepository(TopGenre);

    try {
        const users = await usersRepository
            .createQueryBuilder('users')
            .orderBy('users.id', 'ASC')
            .getMany();

        if (users && users.length) {
            const response: any = {};

            for (const user of users) {
                const genres = {};
                const availableGenres = await genresRepository
                    .createQueryBuilder('genres')
                    .where('genres.name <> "N/A"')
                    .getMany();

                for (const genre of availableGenres) {
                    genres[genre.name] = {
                        id: genre.id,
                        count: 0,
                        value: 0
                    };
                }

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
                            }
                        }
                    }

                    const mappedGenres = Object.keys(genres).map((name) => {
                        const avg: Number = (genres[name].value && genres[name].count) ? genres[name].value / genres[name].count : 0;
                        return {
                            name,
                            ...genres[name],
                            avg: avg.toFixed(2)
                        };
                    });

                    await topGenresRepository
                        .createQueryBuilder()
                        .delete()
                        .from(TopGenre)
                        .where('userId = :id', { id: user.id })
                        .execute();
                    await saveTopGenres(topGenresRepository, user.id, mappedGenres);
                }
            }

            response.status = 'Data about top genres were reloaded';
            return res.send(response);
        }

        return res.boom.badRequest('No users found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
