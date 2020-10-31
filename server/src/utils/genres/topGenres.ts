import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { LimitType, TopGenre, TopGenreType } from '../../entities/TopGenre';

export const getMostRatedGenres = (genres, num = 3) => {
    const ratedGenres = genres.filter(genre => genre.count);

    if (ratedGenres && ratedGenres.length > 0) {
        return _.orderBy(genres, ['count'], ['desc']).slice(0, num);
    }

    return [];
};

export const getMostValuedGenres = (genres, num = 3) => {
    const ratedGenres = genres.filter(genre => genre.count);

    if (ratedGenres && ratedGenres.length > 0) {
        return _.orderBy(genres, ['value'], ['desc']).slice(0, num);
    }

    return [];
};

export const getLeastRatedGenres = (allGenres, num = 3) => {
    const notRatedGenres = allGenres.filter(genre => genre.count === 0);

    if (notRatedGenres && notRatedGenres.length < num) {
        let genres = allGenres.filter(genre => genre.count);
        genres = [
            ..._.orderBy(genres, ['count'], ['desc']).slice(Math.max(genres.length - (num - notRatedGenres.length), 0)),
            ...notRatedGenres
        ];

        return genres;
    }

    return notRatedGenres;
};

export const getLeastValuedGenres = (allGenres, num = 3) => {
    const notRatedGenres = allGenres.filter(genre => genre.count === 0);

    if (notRatedGenres && notRatedGenres.length < num) {
        let genres = allGenres.filter(genre => genre.count);
        genres = [
            ..._.orderBy(genres, ['value'], ['desc']).slice(Math.max(genres.length - (num - notRatedGenres.length), 0)),
            ...notRatedGenres
        ];

        return genres;
    }

    return notRatedGenres;
};

export const getTopGenres = (genres) => {
    return {
        mostRated: getMostRatedGenres(genres, 3),
        mostValued: getMostValuedGenres(genres, 3),
        leastRated: getLeastRatedGenres(genres, 3),
        leastValued: getLeastValuedGenres(genres, 3),
        mostRatedAll: getMostRatedGenres(genres, 12),
        mostValuedAll: getMostValuedGenres(genres, 12),
        leastRatedAll: getLeastRatedGenres(genres, 12),
        leastValuedAll: getLeastValuedGenres(genres, 12)
    };
};

export const saveTopGenresToDb = async (repository: Repository<TopGenre>, id: number, genres: any, key: string, type: TopGenreType, limit: LimitType) => {
    for (const genre of genres) {
        const topGenre = new TopGenre;
        topGenre.genreId = genre.id;
        topGenre.userId = id;
        topGenre.genreType = type;
        topGenre.genreLimit = limit;
        topGenre.value = genre[key];

        await repository.save(topGenre);
    }
};

export const saveTopGenres = async (repository: Repository<TopGenre>, id: number, genres: any) => {
    const { mostRated, mostValued, leastRated, leastValued, mostRatedAll, mostValuedAll, leastRatedAll, leastValuedAll } = getTopGenres(genres);
    await saveTopGenresToDb(repository, id, mostRated, 'count', TopGenreType.MOST_RATED, LimitType.TOP_THREE);
    await saveTopGenresToDb(repository, id, mostValued, 'value', TopGenreType.MOST_VALUED, LimitType.TOP_THREE);
    await saveTopGenresToDb(repository, id, leastRated, 'count', TopGenreType.LEAST_RATED, LimitType.TOP_THREE);
    await saveTopGenresToDb(repository, id, leastValued, 'value', TopGenreType.LEAST_VALUED, LimitType.TOP_THREE);

    await saveTopGenresToDb(repository, id, mostRatedAll, 'count', TopGenreType.MOST_RATED, LimitType.TOP_TWELVE);
    await saveTopGenresToDb(repository, id, mostValuedAll, 'value', TopGenreType.MOST_VALUED, LimitType.TOP_TWELVE);
    await saveTopGenresToDb(repository, id, leastRatedAll, 'count', TopGenreType.LEAST_RATED, LimitType.TOP_TWELVE);
    await saveTopGenresToDb(repository, id, leastValuedAll, 'value', TopGenreType.LEAST_VALUED, LimitType.TOP_TWELVE);
};
