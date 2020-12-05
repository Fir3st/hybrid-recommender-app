import * as _ from 'lodash';
import {getManager, getRepository} from 'typeorm';
import { FavGenre } from '../../entities/FavGenre';
import { UserRating } from '../../entities/UserRating';
import { Genre } from '../../entities/Genre';
import { TopGenre } from '../../entities/TopGenre';
import { Movie } from '../../entities/Movie';
import { saveTopGenres } from '../../utils/genres/topGenres';

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

    public static async getUserTopGenresAndRatings(userId: number) {
        const manager = getManager();
        const repository = getRepository(Movie);
        const genresRepository = getRepository(Genre);
        const topGenresRepository = getRepository(TopGenre);

        const counts = await manager.query('SELECT genres.id, COUNT(users_ratings.id) AS cnt FROM users_ratings LEFT JOIN movies ON users_ratings.movieId = movies.id LEFT JOIN movies_genres ON movies_genres.moviesId = movies.id LEFT JOIN genres ON movies_genres.genresId = genres.id GROUP BY genres.id ORDER BY cnt DESC;');

        const genres = {};
        const availableGenres = await genresRepository
            .createQueryBuilder('genres')
            .where('genres.name <> "N/A"')
            .getMany();

        for (const genre of availableGenres) {
            const genreCount = counts.find(cnt => cnt.id === genre.id);
            genres[genre.name] = {
                id: genre.id,
                count: 0,
                value: 0,
                allCount: genreCount ? parseInt(genreCount.cnt, 10) : 0
            };
        }

        const ratings = await repository
            .createQueryBuilder('movie')
            .leftJoinAndSelect('movie.usersRatings', 'ratings')
            .where('ratings.userId = :id', { id: userId })
            .orderBy({
                'ratings.rating': 'DESC',
                'ratings.createdAt': 'DESC'
            })
            .limit(20)
            .getMany();

        const movies = await repository
            .createQueryBuilder('movie')
            .leftJoinAndSelect('movie.usersRatings', 'ratings')
            .leftJoinAndSelect('movie.genres', 'genres')
            .where('ratings.userId = :id', { id: userId })
            .getMany();

        if (ratings && ratings.length && movies && movies.length > 0) {
            for (const movie of movies) {
                for (const genre of movie.genres) {
                    genres[genre.name].count += 1;
                    genres[genre.name].value += movie.usersRatings[0].rating;
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
                .where('userId = :id', { id: userId })
                .execute();
            await saveTopGenres(topGenresRepository, userId, mappedGenres);

            return { ratings, genres: mappedGenres };
        }

        return { genres, ratings: [] };
    }
}
