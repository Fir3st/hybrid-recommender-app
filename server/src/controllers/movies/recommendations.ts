import axios from 'axios';
import * as _ from 'lodash';
import * as config from 'config';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import winston from '../../utils/winston';
import { Movie } from '../../entities/Movie';

export const getRecommendations = async (req: Request, res: any) => {
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
                const moviesForRes = movies.map(async (item) => {
                    const rec = recommendedMovies.find(movie => movie.id === item.id);
                    const movie = {
                        ...item
                    };
                    movie['similarity'] = rec ? parseFloat(rec.similarity).toFixed(3) : null;
                    const stats = await repository
                        .createQueryBuilder('movie')
                        .leftJoinAndSelect('movie.usersRatings', 'usersRatings')
                        .select([
                            'AVG(usersRatings.rating) AS avgRating',
                            'COUNT(usersRatings.id) AS ratingsCount',
                            'movie.id'
                        ])
                        .groupBy('movie.id')
                        .where('movie.id = :id', { id: item.id })
                        .getRawOne();

                    if (stats) {
                        movie['avgRating'] = stats.avgRating;
                        movie['ratingsCount'] = stats.ratingsCount;
                    }

                    return movie;
                });

                return res.send(_.orderBy(await Promise.all(moviesForRes), ['similarity'], ['desc']));
            }

            return res.send(recommendations.data);
        }

        return res.boom.badRequest(`No recommendations for ${id}.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
};
