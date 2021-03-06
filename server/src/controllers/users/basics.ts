// @ts-nocheck
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
import { Result } from '../../entities/Result';
import { LimitType, TopGenre, TopGenreType } from '../../entities/TopGenre';
import UsersUtil from '../../utils/users/UsersUtil';
import { genre } from '../../../tests/helpers';

export const getUsers = async (req: Request, res: any) => {
    const take: any = req.query.take || 10;
    const skip: any = req.query.skip || 0;
    const orderBy = req.query.orderBy || 'id';
    const order: any = req.query.order || 'ASC';
    const repository = getRepository(User);

    try {
        const query = repository
            .createQueryBuilder('users')
            .orderBy(`users.${orderBy}`, order)
            .leftJoinAndSelect('users.ratings', 'ratings');

        if (take && take !== '-1') {
            query.take(take).skip(skip);
        }

        const users = await query.getMany();

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
        user.massResult = '';

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
            .leftJoinAndSelect('movie.genres', 'genres')
            .leftJoinAndSelect('user.favouriteGenres', 'favGenres')
            .leftJoinAndSelect('favGenres.genre', 'genre')
            .where('user.id = :id', { id })
            .getOne();
        console.log(user);

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

export const getUserGroup = async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);
    const repository = getRepository(TopGenre);
    const userRepository = getRepository(User);

    try {
        const userGenres = await repository
            .createQueryBuilder('genres')
            .where('genres.genreType IN (:types)', { types: [TopGenreType.MOST_RATED, TopGenreType.LEAST_RATED] })
            .andWhere('genres.genreLimit = :limitType', { limitType: LimitType.TOP_THREE })
            .andWhere('genres.userId = :id', { id })
            .getMany();

        const userMostGenres = userGenres.filter(genre => genre.genreType === TopGenreType.MOST_RATED).map(genre => genre.genreId);
        const userLeastGenres = userGenres.filter(genre => genre.genreType === TopGenreType.LEAST_RATED).map(genre => genre.genreId);

        let similarUsersMost = await repository
            .createQueryBuilder('genres')
            .select('genres.userId as userId, count(genres.userId) as cnt')
            .where('genres.genreId IN (:ids)', { ids: userMostGenres })
            .andWhere('genres.genreType = :genreType', { genreType: TopGenreType.MOST_RATED })
            .andWhere('genres.genreLimit = :genreLimit', { genreLimit: LimitType.TOP_THREE })
            .groupBy('genres.userId')
            .having('cnt = 3')
            .getRawMany();

        let similarUsersLeast = await repository
            .createQueryBuilder('genres')
            .select('genres.userId as userId, count(genres.userId) as cnt')
            .where('genres.genreId IN (:ids)', { ids: userLeastGenres })
            .andWhere('genres.genreType = :genreType', { genreType: TopGenreType.LEAST_RATED })
            .andWhere('genres.genreLimit = :genreLimit', { genreLimit: LimitType.TOP_THREE })
            .groupBy('genres.userId')
            .having('cnt >= 2')
            .getRawMany();

        similarUsersMost = similarUsersMost.map(item => item.userId);
        similarUsersLeast = similarUsersLeast.map(item => item.userId);

        const similarUsers = _.intersection(similarUsersMost, similarUsersLeast);

        const users = await userRepository
            .createQueryBuilder('users')
            .where('users.id IN (:ids)', { ids: similarUsers })
            .getMany();

        return res.send({ users: users.length ? users.map(user => _.pick(user, ['id', 'name', 'surname'])) : [] });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const analyzeUser = async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);

    try {
        const { genres, ratings } = await UsersUtil.getUserTopGenresAndRatings(id);

        return res.send({ ratings, genres });
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
    const ratedMovies = req.body.ratings || [];

    try {
        if (ratedMovies.length > 0) {
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

            await UsersUtil.computeUserGenres(userId);
            await UsersUtil.getUserTopGenresAndRatings(userId);
            await axios.put(`${recommender}/train/users/${userId}`);

            return res.send({ message: 'Questionnaire sent successfully.' });
        }

        return res.boom.badRequest('Not enough data.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const sendResults = async (req: Request, res: any) => {
    const repository = getRepository(Result);
    const favGenresRepository = getRepository(FavGenre);
    const topGenresRepository = getRepository(TopGenre);
    const results = req.body.results;
    const { items, settings, id: userId } = req.body.user;

    try {
        const favGenres = await favGenresRepository.find({ where: { userId }, relations: ['genre'] });
        const favouriteGenres = favGenres.filter(genre => genre.type === 1);
        const notFavouriteGenres = favGenres.filter(genre => genre.type === -1);
        const topGenres = await topGenresRepository.find({ where: { userId }, relations: ['genre'] });
        const top3 = topGenres.filter(genre => genre.genreType === TopGenreType.MOST_RATED && genre.genreLimit === LimitType.TOP_THREE);
        const least3 = topGenres.filter(genre => genre.genreType === TopGenreType.LEAST_RATED && genre.genreLimit === LimitType.TOP_THREE);
        const top12 = topGenres.filter(genre => genre.genreType === TopGenreType.MOST_RATED && genre.genreLimit === LimitType.TOP_TWELVE);
        const least12 = topGenres.filter(genre => genre.genreType === TopGenreType.LEAST_RATED && genre.genreLimit === LimitType.TOP_TWELVE);

        const result = new Result();
        result.resultType = 1;
        result.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        result.userId = userId;
        const data = {
            settings,
            favouriteGenres,
            notFavouriteGenres,
            items,
            results,
            top3,
            least3,
            top12,
            least12
        };
        result.data = JSON.stringify(data);
        await repository.save(result);
        return res.send({ message: `Results for user ${userId} saved in database.` });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
