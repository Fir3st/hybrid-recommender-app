export const state = () => ({
    movies: [],
    count: 0,
    activeMovie: null
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
    }
};

export const actions = {
    setMovies({ commit }, movies) {
        commit('setMovies', movies);
    },
    setCount({ commit }, count) {
        commit('setCount', count);
    },
    setActiveMovie({ commit }, activeMovie) {
        commit('setActiveMovie', activeMovie);
    },
};
