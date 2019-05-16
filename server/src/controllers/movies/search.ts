import axios from 'axios';
import * as _ from 'lodash';
import * as config from 'config';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import { Movie } from '../../entities/Movie';
import MoviesUtil from '../../utils/movies/MoviesUtil';
import SearchUtil from '../../utils/search/SearchUtil';
import winston from '../../utils/winston';

export const search = async (req: Request, res: any) => {
    const repository = getRepository(Movie);
    const { searchQuery, genres, type, take, skip } = SearchUtil.getQueryArgs(req.query);

    try {
        let movies;
        let count = 0;

        if (genres && genres.length > 0) {
            const query = repository
                .createQueryBuilder('movies')
                .leftJoin('movies.genres', 'genres')
                .select(['movies.id'])
                .where('genres.id IN (:genres)', { genres })
                .groupBy('movies.id')
                .having('COUNT(genres.id) = :count', { count: genres.length });

            if (type !== 'all') {
                query.andWhere('movies.type = :type', { type });
            }

            movies = await query.getMany();
            count = movies.length;

            if (movies && movies.length > 0) {
                const query = repository
                    .createQueryBuilder('movies')
                    .leftJoinAndSelect('movies.genres', 'genres')
                    .where('movies.id IN (:ids)', { ids: movies.map(item => item.id) })
                    .orderBy('movies.year', 'DESC')
                    .take(take)
                    .skip(skip);

                movies = await query.getMany();
            }
        } else {
            const query = repository
                .createQueryBuilder('movies')
                .leftJoinAndSelect('movies.genres', 'genres')
                .where('LOWER(movies.title) LIKE :query', { query: `%${searchQuery.toLowerCase()}%` })
                .orderBy('movies.year', 'DESC');

            count = await query.getCount();
            movies = await query.take(take).skip(skip).getMany();
        }

        if (movies && movies.length > 0) {
            const moviesForRes = MoviesUtil.getMoviesStats(movies);
            return res.send({ count, movies: await Promise.all(moviesForRes) });
        }

        return res.boom.badRequest('No movies found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};

export const securedSearch = async (req: Request, res: any) => {
    const user = req.user;
    const repository = getRepository(Movie);
    const recommender = config.get('recommenderUrl');
    const { searchQuery, genres, type, take, skip, includeRated } = SearchUtil.getQueryArgs(req.query);

    try {
        let movies;
        let count = 0;

        if (genres && genres.length > 0) {
            let url = `${recommender}/search/${user.id}?take=${take}&skip=${skip}&includeRated=${includeRated}`;
            if (genres && genres.length > 0) {
                url = `${url}&genres=${genres}`;
            }
            if (type !== 'all') {
                url = `${url}&type=${type}`;
            }

            const recsResponse = await axios.get(url);
            const { recommendations } = recsResponse.data;

            if (recommendations && recommendations.length > 0) {
                const moviesIds = recommendations.map(item => item.id);
                movies = await repository
                    .createQueryBuilder('movies')
                    .leftJoinAndSelect('movies.genres', 'genres')
                    .where('movies.id IN (:ids)', { ids: moviesIds })
                    .getMany();

                if (movies && movies.length > 0) {
                    const moviesForRes = MoviesUtil.getMoviesStats(movies, recommendations, 'rating');
                    movies = _.orderBy(await Promise.all(moviesForRes), ['rating'], ['desc']);
                } else {
                    movies = recommendations;
                }
                count = recsResponse.data.ratingsCount;
            }
        } else {
            const query = repository
                .createQueryBuilder('movies')
                .leftJoinAndSelect('movies.genres', 'genres')
                .leftJoinAndSelect('movies.usersRatings', 'usersRatings')
                .where('LOWER(movies.title) LIKE :query', { query: `%${searchQuery.toLowerCase()}%` })
                .orderBy('movies.year', 'DESC');

            movies = await query.getMany();
            if (movies && movies.length > 0) {
                movies = movies.map(movie => MoviesUtil.isPenalizedByUser(movie, user));
                movies = await MoviesUtil.getQueriedMoviesRatings(movies, user, recommender);
                const moviesForRes = MoviesUtil.getMoviesStats(movies);
                movies = await Promise.all(moviesForRes);
                movies = _.sortBy(movies, ['isPenalized']);
            }
            count = await query.getCount();
        }

        if (movies && movies.length > 0) {
            return res.send({ count, movies });
        }

        return res.boom.badRequest('No movies found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
