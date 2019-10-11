import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import * as config from 'config';
import * as moment from 'moment';
import axios from 'axios';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import winston from '../../utils/winston';
import { validateRegister } from '../../utils/validations/user';
import { User } from '../../entities/User';
import { Movie } from '../../entities/Movie';
import { UserRating } from '../../entities/UserRating';
import { FavGenre } from '../../entities/FavGenre';

export const getUsers = async (req: Request, res: any) => {
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
            return res.send(users.map(user => _.omit(user, ['password'])));
        }

        return res.boom.badRequest('No users found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const createUser = async (req: Request, res: any) => {
    const { error, value: validated } = validateRegister(req.body);
    const userRepository = getRepository(User);

    if (error) {
        return res.boom.badRequest('Name, surname, email and password must be supplied.');
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
        user.admin = false;
        user.password = await bcrypt.hash(validated.password, 10);

        const createdUser = await userRepository.save(user);
        return res.send(_.omit(createdUser, ['password']));
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const countUsers = async (req: Request, res: any) => {
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
};

export const getUser = async (req: Request, res: any) => {
    const userRepository = getRepository(User);

    try {
        const user = await userRepository.findOne({ id: req.user.id });

        if (user) {
            return res.send({ user: _.omit(user, ['password']) });
        }

        return res.boom.badRequest('Authentication failed.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const getUserByID = async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);
    const repository = getRepository(User);

    try {
        const user = await repository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.ratings', 'ratings')
            .leftJoinAndSelect('ratings.movie', 'movie')
            .leftJoinAndSelect('user.favouriteGenres', 'favGenres')
            .leftJoinAndSelect('favGenres.genre', 'genre')
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
};

export const deleteUser = async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);
    const repository = getRepository(User);

    try {
        const user = await repository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();

        if (user) {
            await repository.delete(user);
            return res.send({ message: 'User was deleted.' });
        }

        return res.boom.badRequest(`User with id ${id} not found.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const getPreferences = async (req: Request, res: any) => {
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
};

export const sendQuestionnaire = async (req: Request, res: any) => {
    const recommender = config.get('recommenderUrl');
    const ratingsRepository = getRepository(UserRating);
    const favGenresRepository = getRepository(FavGenre);
    const userId = parseInt(req.user.id, 10);
    const favouriteGenres = req.body.favouriteGenres || [];
    const notFavouriteGenres = req.body.notFavouriteGenres || [];
    const ratedMovies = req.body.ratings || [];

    try {
        if (favouriteGenres.length > 0 && notFavouriteGenres.length > 0 && ratedMovies.length > 0) {
            const userRatings = await ratingsRepository
                .createQueryBuilder('ratings')
                .where('ratings.userId = :userId', { userId })
                .getMany();

            if (userRatings && userRatings.length > 0) {
                await ratingsRepository
                    .createQueryBuilder()
                    .delete()
                    .from(UserRating)
                    .where('id IN (:ids)', { ids: userRatings.map(item => item.id) })
                    .execute();
            }

            const favGenres = await favGenresRepository
                .createQueryBuilder('genres')
                .where('genres.userId = :userId', { userId })
                .getMany();

            if (favGenres && favGenres.length > 0) {
                await favGenresRepository
                    .createQueryBuilder()
                    .delete()
                    .from(FavGenre)
                    .where('id IN (:ids)', { ids: favGenres.map(item => item.id) })
                    .execute();
            }

            for (const ratedMovie of ratedMovies) {
                const rating = new UserRating();
                rating.movieId = ratedMovie.id;
                rating.userId = userId;
                rating.rating = ratedMovie.rating;
                rating.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
                await ratingsRepository.save(rating);
            }

            for (const favGenre of favouriteGenres) {
                const genre = new FavGenre();
                genre.genreId = favGenre;
                genre.userId = userId;
                genre.type = 1;
                await favGenresRepository.save(genre);
            }

            for (const favGenre of notFavouriteGenres) {
                const genre = new FavGenre();
                genre.genreId = favGenre;
                genre.userId = userId;
                genre.type = -1;
                await favGenresRepository.save(genre);
            }

            axios.put(`${recommender}/train/users/${userId}`);

            return res.send({ message: 'Questionnaire sent successfully.' });
        }

        return res.boom.badRequest('Not enough data.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
