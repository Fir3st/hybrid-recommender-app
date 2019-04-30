export default class SearchUtil {
    public static getQueryArgs(query) {
        const searchQuery = query.query || '';
        const genres = query.genres ? query.genres.split(',').map(item => parseInt(item, 10)) : [];
        const type = query.type || 'all';
        const take = query.take || 10;
        const skip = query.skip || 0;

        return {
            searchQuery,
            genres,
            type,
            take,
            skip
        };
    }
}
