export const state = () => ({
    movies: [],
    count: 0,
    activeMovie: null,
    take: 20,
    skip: 0,
});

export const getters = {
    movies (state) {
        return state.movies;
    },
    count (state) {
        return state.count;
    },
    activeMovie (state) {
        return state.activeMovie;
    },
    take (state) {
        return state.take;
    },
    skip (state) {
        return state.skip;
    }
};

export const mutations = {
    setMovies (state, movies) {
        state.movies = movies;
    },
    setCount (state, count) {
        state.count = count;
    },
    setActiveMovie(state, activeMovie) {
        state.activeMovie = activeMovie;
    },
    setPagination(state, skip) {
        state.skip = skip;
    },
};

export const actions = {
    async setMovies({ commit, state }) {
        try {
            const movies = await this.$axios.$get(`/movies?take=${state.take}&skip=${state.skip}`);

            if (movies && movies.length > 0) {
                commit('setMovies', movies);
            }
        } catch (error) {
            console.log(error);
        }
    },
    async setCount({ commit }) {
        try {
            const moviesCount = await this.$axios.$get(`/movies/count`);

            if (moviesCount) {
                commit('setCount', moviesCount.count);
            }
        } catch (error) {
            console.log(error);
        }
    },
    setActiveMovie({ commit }, activeMovie) {
        commit('setActiveMovie', activeMovie);
    },
    setPagination({ commit, dispatch }, skip) {
        commit('setPagination', skip);
        dispatch('setMovies');
    },
};
