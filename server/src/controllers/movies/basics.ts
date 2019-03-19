import { Request } from 'express';
import { getRepository } from 'typeorm';
import { Movie } from '../../entities/Movie';
import winston from '../../utils/winston';

export const getMovies = async (req: Request, res: any) => {
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
};

export const getTopMovies = async (req: Request, res: any) => {
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
};

export const getCount = async (req: Request, res: any) => {
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
};

export const getMovieByID = async (req: Request, res: any) => {
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
};

export const search = async (req: Request, res: any) => {
    const repository = getRepository(Movie);
    const title = req.params.query || '';

    try {
        const query = repository
            .createQueryBuilder('movies')
            .where('LOWER(movies.title) LIKE :query', { query: `%${title.toLowerCase()}%` })
            .orderBy('movies.year', 'DESC');

        const movies = await query.getMany();

        if (movies && movies.length > 0) {
            return res.send(movies);
        }

        return res.boom.badRequest('No movies found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
