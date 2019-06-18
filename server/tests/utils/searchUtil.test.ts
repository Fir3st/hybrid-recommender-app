import SearchUtil from '../../src/utils/search/SearchUtil';

describe('getQueryArgs', () => {
    it('search query should match the input', async () => {
        const query = {
            query: 'test'
        };
        const queryArgs = SearchUtil.getQueryArgs(query);

        expect(queryArgs.searchQuery).toEqual(query.query);
    });

    it('genres in the result should match the input', async () => {
        const query = {
            genres: '1,2,3'
        };
        const queryArgs = SearchUtil.getQueryArgs(query);
        const genres = query.genres.split(',').map(item => parseInt(item, 10));

        expect(queryArgs.genres).toEqual(genres);
    });

    it('take and skip in the result should match the input', async () => {
        const query = {
            take: 100,
            skip: 5
        };
        const queryArgs = SearchUtil.getQueryArgs(query);

        expect(queryArgs.take).toEqual(query.take);
        expect(queryArgs.skip).toEqual(query.skip);
    });

    it('take and skip in the result should have default value if they are not provided in the input', async () => {
        const query = {
        };
        const queryArgs = SearchUtil.getQueryArgs(query);

        expect(queryArgs.take).toEqual(10);
        expect(queryArgs.skip).toEqual(0);
    });

    it('type should be all if no type is provided in the input', async () => {
        const query = {
        };
        const queryArgs = SearchUtil.getQueryArgs(query);

        expect(queryArgs.type).toEqual('all');
    });

    it('type should match type in the input', async () => {
        const query = {
            type: 'movie'
        };
        const queryArgs = SearchUtil.getQueryArgs(query);

        expect(queryArgs.type).toEqual(query.type);
    });

    it('includeRated in the result should be false if it\'s not provided in the input', async () => {
        const query = {
        };
        const queryArgs = SearchUtil.getQueryArgs(query);

        expect(queryArgs.includeRated).toEqual('false');
    });

    it('includeRated in the result should match the input', async () => {
        const query = {
            includeRated: 'false'
        };
        const queryArgs = SearchUtil.getQueryArgs(query);

        expect(queryArgs.includeRated).toEqual(query.includeRated);
    });
});
