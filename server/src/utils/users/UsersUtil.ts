import * as _ from 'lodash';
import { getRepository } from 'typeorm';
import { FavGenre } from '../../entities/FavGenre';
import { UserRating } from '../../entities/UserRating';

export default class UsersUtil {
    public static async getUserGenres(userId: number) {
        const favGenres = [];
        const notFavGenres = [];
        const repository = getRepository(FavGenre);

        try {
            const genres = await repository
                .createQueryBuilder('genres')
                .where('userId = :userId', { userId })
                .getMany();

            if (genres && genres.length > 0) {
                favGenres.push(...genres.filter(item => item.type === 1).map(item => item.genreId));
                notFavGenres.push(...genres.filter(item => item.type === -1).map(item => item.genreId));
            }
        } catch (error) {
            console.log(error.message);
        }

        return {
            favGenres,
            notFavGenres
        };
    }

    public static async computeUserGenres(userId: number) {
        const numOfGenres = 3;
        const minRatingValue = 2.5;
        const ratingsRepository = getRepository(UserRating);
        const genresRepository = getRepository(FavGenre);

        try {
            const userRatings = await ratingsRepository
                .createQueryBuilder('ratings')
                .leftJoinAndSelect('ratings.movie', 'movie')
                .leftJoinAndSelect('movie.genres', 'genres')
                .where('ratings.userId = :userId', { userId })
                .getMany();

            if (userRatings && userRatings.length > 0) {
                const positiveRatings = userRatings.filter(item => item.rating > minRatingValue);
                const negativeRatings = userRatings.filter(item => item.rating <= minRatingValue);
                const positiveGenres = _.flatten(positiveRatings.map(item => item.movie.genres)).map(item => item.id);
                const negativeGenres = _.flatten(negativeRatings.map(item => item.movie.genres)).map(item => item.id);

                const positiveGenresCount = {};
                for (const genre of positiveGenres) {
                    if (genre in positiveGenresCount) {
                        positiveGenresCount[genre] += 1;
                    } else {
                        positiveGenresCount[genre] = 1;
                    }
                }
                for (const genre of negativeGenres) {
                    if (genre in positiveGenresCount && positiveGenresCount[genre] > 0) {
                        positiveGenresCount[genre] -= 1;
                    }
                }
                const topPositiveGenres = _.sortBy(Object.keys(positiveGenresCount).map((key) => {
                        return { key, count: positiveGenresCount[key] };
                    }), 'count')
                    .reverse()
                    .filter(item => item.count > 0)
                    .slice(0, numOfGenres)
                    .map(item => item.key);

                const negativeGenresCount = {};
                for (const genre of negativeGenres) {
                    if (genre in negativeGenresCount) {
                        negativeGenresCount[genre] += 1;
                    } else {
                        negativeGenresCount[genre] = 1;
                    }
                }
                for (const genre of positiveGenres) {
                    if (genre in negativeGenresCount && negativeGenresCount[genre] > 0) {
                        negativeGenresCount[genre] -= 1;
                    }
                }
                const topNegativeGenres = _.sortBy(Object.keys(negativeGenresCount).map((key) => {
                    return { key, count: negativeGenresCount[key] };
                }), 'count')
                    .reverse()
                    .filter(item => item.count > 0)
                    .slice(0, numOfGenres)
                    .map(item => item.key);

                if (topPositiveGenres.length > 0) {
                    await genresRepository
                        .createQueryBuilder()
                        .delete()
                        .from(FavGenre)
                        .where('userId = :userId', { userId })
                        .andWhere('type = :type', { type: 1 })
                        .execute();

                    for (const positiveGenre of topPositiveGenres) {
                        const genre = new FavGenre();
                        genre.genreId = parseInt(positiveGenre, 10);
                        genre.userId = userId;
                        genre.type = 1;
                        await genresRepository.save(genre);
                    }
                }

                if (topNegativeGenres.length > 0) {
                    await genresRepository
                        .createQueryBuilder()
                        .delete()
                        .from(FavGenre)
                        .where('userId = :userId', { userId })
                        .andWhere('type = :type', { type: -1 })
                        .execute();

                    for (const negativeGenre of topNegativeGenres) {
                        const genre = new FavGenre();
                        genre.genreId = parseInt(negativeGenre, 10);
                        genre.userId = userId;
                        genre.type = -1;
                        await genresRepository.save(genre);
                    }
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}
