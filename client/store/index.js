export const actions = {
    async nuxtServerInit ({ dispatch }) {
        await dispatch('genres/setMoviesGenres');
        await dispatch('genres/setSeriesGenres');
        await dispatch('genres/setGenres');
    }
};
