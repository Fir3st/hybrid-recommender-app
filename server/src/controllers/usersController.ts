import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import * as config from 'config';
import axios from 'axios';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { User } from '../entities/User';
import { validateRegister } from '../utils/validations/user';
import { authenticate, authorize } from '../middleware/auth';
import { Movie } from '../entities/Movie';
import MoviesUtil from '../utils/movies/MoviesUtil';

const router = Router();

router.get('/', [authenticate, authorize], async (req: Request, res: any) => {
    const take = req.query.take || 10;
    const skip = req.query.skip || 0;
    const orderBy = req.query.orderBy || 'id';
    const order = req.query.order || 'ASC';
    const repository = getRepository(User);

    try {
        const users = await repository
            .createQueryBuilder('users')
            .orderBy(`users.${orderBy}`, order)
            .take(take)
            .skip(skip)
            .getMany();

        if (users && users.length > 0) {
            return res.send(users.map(user => _.pick(user, ['id', 'name', 'surname', 'email', 'admin'])));
        }

        return res.boom.badRequest('No users found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/count', [authenticate, authorize], async (req: Request, res: any) => {
    const repository = getRepository(User);

    try {
        const usersCount = await repository
            .createQueryBuilder('users')
            .getCount();

        if (usersCount) {
            return res.send({ count: usersCount });
        }

        return res.boom.badRequest('No users found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/me', authenticate, async (req: Request, res: any) => {
    const userRepository = getRepository(User);

    try {
        const user = await userRepository.findOne({ id: req.user.id });

        if (user) {
            return res.send({ user: _.pick(user, ['id', 'name', 'surname', 'email', 'admin']) });
        }

        return res.boom.badRequest('Authentication failed');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:id', authenticate, async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user.id, 10);
    const repository = getRepository(User);

    if ((id !== userId) && !req.user.admin) {
        return res.boom.badRequest('You have no permissions to perform this action.');
    }

    try {
        const user = await repository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.ratings', 'ratings')
            .leftJoinAndSelect('ratings.movie', 'movie')
            .where('user.id = :id', { id })
            .getOne();

        if (user) {
            return res.send({ ..._.omit(user, ['password']) });
        }

        return res.boom.badRequest(`User with id ${id} not found.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.post('/', async (req: Request, res: any) => {
    const { error, value: validated } = validateRegister(req.body);
    const userRepository = getRepository(User);

    if (error) {
        return res.boom.badRequest('Name, surname, email and password must be supplied');
    }

    try {
        const existing = await userRepository.findOne({ email: validated.email });
        if (existing) {
            return res.boom.badRequest('User with given email already exists.');
        }

        const user = new User();
        user.name = validated.name;
        user.surname = validated.surname;
        user.email = validated.email;
        user.admin = (validated.admin !== undefined) ? validated.admin : true;
        user.password = await bcrypt.hash(validated.password, 10);

        const createdUser = await userRepository.save(user);
        return res.send(_.pick(createdUser, ['id', 'name', 'surname', 'email', 'admin']));
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:id/recommendations', authenticate, async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user.id, 10);
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    if ((id !== userId) && !req.user.admin) {
        return res.boom.badRequest('You have no permissions to perform this action.');
    }

    try {
        const recommendations = await axios.get(`${recommender}/users/${id}/recommendations`);

        if (recommendations && recommendations.data.recommendations && recommendations.data.recommendations.length > 0) {
            const moviesIds = recommendations.data.recommendations.map(item => item.id);
            const movies = await repository
                .createQueryBuilder('movies')
                .leftJoinAndSelect('movies.usersRatings', 'usersRatings')
                .select([
                    'AVG(usersRatings.rating) AS avgRating',
                    'COUNT(usersRatings.id) AS ratingsCount',
                    'movies.id',
                    'movies.title',
                    'movies.poster',
                    'movies.year',
                    'movies.plot'
                ])
                .groupBy('movies.id')
                .where('movies.id IN (:ids)', { ids: moviesIds })
                .getRawMany();

            if (movies && movies.length > 0) {
                const moviesForRes = movies.map((item) => {
                    const recommendedMovie = recommendations.data.recommendations.find(movie => parseInt(movie.id, 10) === parseInt(item.movies_id, 10));
                    return {
                        ...MoviesUtil.transformMovieData(item),
                        rating: recommendedMovie ? parseFloat(recommendedMovie.rating).toFixed(3) : null
                    };
                });
                return res.send(_.orderBy(moviesForRes, ['rating'], ['desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for user ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:id/preferences', [authenticate, authorize], async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);
    const repository = getRepository(Movie);

    try {
        const genres = {};
        const movies = await repository
            .createQueryBuilder('movie')
            .leftJoinAndSelect('movie.usersRatings', 'ratings')
            .leftJoinAndSelect('movie.genres', 'genres')
            .where('ratings.userId = :id', { id })
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

            return res.send(Object.keys(genres).map((name) => {
                const avg: Number = genres[name].value / genres[name].count;
                return {
                    name,
                    ...genres[name],
                    avg: avg.toFixed(2)
                };
            }));
        }

        return res.boom.badRequest(`User with id ${id} not found.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:userId/:movieId/recommendations', authenticate, async (req: Request, res: any) => {
    const userId = parseInt(req.params.userId, 10);
    const movieId = parseInt(req.params.movieId, 10);
    const loggedUserId = parseInt(req.user.id, 10);
    const recommender = config.get('recommenderUrl');
    const repository = getRepository(Movie);

    if ((userId !== loggedUserId) && !req.user.admin) {
        return res.boom.badRequest('You have no permissions to perform this action.');
    }

    try {
        const recommendations = await axios.get(`${recommender}/recommendations/${userId}/${movieId}`);

        if (recommendations && recommendations.data.recommendations && recommendations.data.recommendations.length > 0) {
            const moviesIds = recommendations.data.recommendations.map(item => item.id);
            const movies = await repository
                .createQueryBuilder('movies')
                .leftJoinAndSelect('movies.usersRatings', 'usersRatings')
                .select([
                    'AVG(usersRatings.rating) AS avgRating',
                    'COUNT(usersRatings.id) AS ratingsCount',
                    'movies.id',
                    'movies.title',
                    'movies.poster',
                    'movies.year',
                    'movies.plot'
                ])
                .groupBy('movies.id')
                .where('movies.id IN (:ids)', { ids: moviesIds })
                .getRawMany();

            if (movies && movies.length > 0) {
                const moviesForRes = movies.map((item) => {
                    const recommendedMovie = recommendations.data.recommendations.find(movie => parseInt(movie.id, 10) === item.movies_id);
                    const result: any = {
                        ...MoviesUtil.transformMovieData(item)
                    };
                    if ('rating' in recommendedMovie) {
                        result['rating'] = recommendedMovie ? parseFloat(recommendedMovie.rating).toFixed(3) : null;
                    }
                    if ('similarity' in recommendedMovie) {
                        result['similarity'] = recommendedMovie ? parseFloat(recommendedMovie.similarity).toFixed(3) : null;
                    }
                    return result;
                });

                return res.send(_.orderBy(moviesForRes, ['similarity', 'rating'], ['desc', 'desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for user ${userId} and movie ${movieId}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
