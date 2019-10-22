import axios from 'axios';
import * as config from 'config';
import * as moment from 'moment';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import winston from '../../utils/winston';
import { UserRating } from '../../entities/UserRating';
import { Movie } from '../../entities/Movie';
import UsersUtil from '../../utils/users/UsersUtil';

export const getMovieRatings = async (req: Request, res: any) => {
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
};

export const getMovieRatingByID = async (req: Request, res: any) => {
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
};

export const getAvgRating = async (req: Request, res: any) => {
    const id = req.params.id;
    const repository = getRepository(Movie);

    try {
        const movieAvgRating = await repository
            .createQueryBuilder('movie')
            .leftJoinAndSelect('movie.usersRatings', 'usersRatings')
            .select([
                'movie.id',
                'AVG(usersRatings.rating) AS avgRating'
            ])
            .where('movie.id = :id', { id })
            .getRawOne();

        if (movieAvgRating && movieAvgRating.movie_id !== null) {
            return res.send({ id: movieAvgRating.movie_id, avgRating: movieAvgRating.avgRating });
        }

        return res.boom.badRequest(`Movie with id ${id} not found.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const rateMovie = async (req: Request, res: any) => {
    const id = parseInt(req.params.id, 10);
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
        await UsersUtil.computeUserGenres(userId);
        await axios.put(`${recommender}/train/users/${userId}`);

        return res.send({ message: 'Rating added successfully.' });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
