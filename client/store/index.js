export const actions = {
    async nuxtServerInit ({ dispatch }) {
        await dispatch('movies/setMovies');
        await dispatch('movies/setCount');
    }
};
