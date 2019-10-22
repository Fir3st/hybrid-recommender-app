import { getRepository } from 'typeorm';
import { FavGenre } from '../../entities/FavGenre';

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
}
