import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import * as _ from 'lodash';
import axios from 'axios';
import * as config from 'config';
import winston from '../utils/winston';
import * as moment from 'moment';
import MoviesUtil from '../utils/movies/MoviesUtil';
import { Movie } from '../entities/Movie';
import { authenticate, authorize } from '../middleware/auth';
import { UserRating } from '../entities/UserRating';
const router = Router();

router.get('/', async (req: Request, res: any) => {
    const take = req.query.take || 10;
    const skip = req.query.skip || 0;
    const type = req.query.type || 'all';
    const genre = req.query.genre || null;
    const orderBy = req.query.orderBy || 'id';
    const order = req.query.order || 'ASC';
    const repository = getRepository(Movie);

    try {
        const query = repository
            .createQueryBuilder('movies')
            .leftJoin('movies.genres', 'genres')
            .orderBy(`movies.${orderBy}`, order)
            .take(take)
            .skip(skip);

        if (type !== 'all') {
            query.where('movies.type = :type', { type });
        }

        if (genre) {
            query.andWhere('LOWER(genres.name) = LOWER(:genre)', { genre });
        }

        const movies = await query.getMany();

        if (movies && movies.length > 0) {
            return res.send(movies);
        }

        return res.boom.badRequest('No movies found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/top', async (req: Request, res: any) => {
    const limit = req.query.limit || 10;
    const type = req.query.type || 'all';
    const genre = req.query.genre || null;
    const repository = getRepository(Movie);

    try {
        const query = repository
            .createQueryBuilder('movies')
            .leftJoinAndSelect('movies.genres', 'genres')
            .leftJoinAndSelect('movies.usersRatings', 'usersRatings')
            .select([
                'AVG(usersRatings.rating) * COUNT(usersRatings.rating) AS movie_score',
                'movies.id',
                'movies.title',
                'movies.poster',
                'movies.year',
                'movies.plot'
            ])
            .groupBy('movies.id')
            .orderBy('movie_score', 'DESC')
            .limit(limit);

        if (type !== 'all') {
            query.where('movies.type = :type', { type });
        }

        if (genre) {
            query.andWhere('LOWER(genres.name) = LOWER(:genre)', { genre });
        }

        const movies = await query.getMany();

        if (movies && movies.length > 0) {
            return res.send(movies);
        }

        return res.boom.badRequest('No top movies found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/count/:type', async (req: Request, res: any) => {
    const type = req.params.type || 'all';
    const genre = req.query.genre || null;
    const repository = getRepository(Movie);

    try {
        const query = repository
            .createQueryBuilder('movies')
            .leftJoin('movies.genres', 'genres');

        if (type !== 'all') {
            query.where('movies.type = :type', { type });
        }

        if (genre) {
            query.andWhere('LOWER(genres.name) = LOWER(:genre)', { genre });
        }

        const moviesCount = await query.getCount();

        if (moviesCount) {
            return res.send({ count: moviesCount });
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

router.put('/:id', async (req: Request, res: any) => {
    const id = req.params.id;
    const receivedMovie = req.body.movie;
    const repository = getRepository(Movie);

    try {
        const movie = await repository
            .createQueryBuilder('movie')
            .where('movie.id = :id', { id })
            .getOne();

        if (movie) {
            MoviesUtil.updateMovie(receivedMovie, movie);
            await repository.save(movie);
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
            const recommendedMovies = recommendations.data.recommendations;
            const moviesIds = recommendedMovies.map(item => item.id);
            const movies = await repository
                .createQueryBuilder('movies')
                .leftJoinAndSelect('movies.genres', 'genres')
                .where('movies.id IN (:ids)', { ids: moviesIds })
                .getMany();

            if (movies && movies.length > 0) {
                const moviesForRes = movies.map((item) => {
                    const recommendedMovie = recommendedMovies.find(movie => movie.id === item.id);
                    return {
                        ...item,
                        similarity: recommendedMovie ? parseFloat(recommendedMovie.similarity).toFixed(3) : null
                    };
                });
                return res.send(_.orderBy(moviesForRes, ['similarity'], ['desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for ${id}`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:id/topics', async (req: Request, res: any) => {
    const id = req.params.id;
    const recommender = config.get('recommenderUrl');

    try {
        const recommendations = await axios.get(`${recommender}/movies/${id}/topics`);

        if (recommendations && recommendations.data.topics && recommendations.data.topics.length > 0) {
            return res.send({ topics: recommendations.data.topics });
        }

        return res.boom.badRequest(`No recommendations for ${id}`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:id/ratings', [authenticate, authorize], async (req: Request, res: any) => {
    const id = req.params.id;
    const repository = getRepository(UserRating);

    try {
        const ratings = await repository
            .createQueryBuilder('userRating')
            .leftJoinAndSelect('userRating.user', 'user')
            .andWhere('userRating.movieId = :id', { id })
            .getMany();

        if (ratings && ratings.length > 0) {
            return res.send(ratings);
        }

        return res.boom.badRequest(`No user ratings found for movie ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:id/rating', authenticate, async (req: Request, res: any) => {
    const id = req.params.id;
    const userId = parseInt(req.user.id, 10);
    const repository = getRepository(UserRating);

    try {
        const rating = await repository
            .createQueryBuilder('userRating')
            .where('userRating.userId = :userId', { userId })
            .andWhere('userRating.movieId = :id', { id })
            .getOne();

        if (rating) {
            return res.send({ value: rating.rating, createdAt: rating.createdAt });
        }

        return res.boom.badRequest(`No user rating found for movie ${id} and user ${userId}`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.post('/:id/rating', authenticate, async (req: Request, res: any) => {
    const id = req.params.id;
    const userId = parseInt(req.user.id, 10);
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(UserRating);

    try {
        let rating = await repository
            .createQueryBuilder('userRating')
            .where('userRating.userId = :userId', { userId })
            .andWhere('userRating.movieId = :id', { id })
            .getOne();

        if (rating) {
            rating.rating = req.body.rating;
        } else {
            rating = new UserRating();
            rating.movieId = id;
            rating.userId = userId;
            rating.rating = req.body.rating;
            rating.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        await repository.save(rating);
        await axios.put(`${recommender}/users/re-train`);

        return res.send({ message: 'Rating added successfully.' });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
