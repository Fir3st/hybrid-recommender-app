export const state = () => ({
    movies: []
});

export const getters = {
    movies (state) {
        return state.movies;
    }
};

export const mutations = {
    setMovies (state, movies) {
        state.movies = movies;
    }
};

export const actions = {
    setMovies({ commit }, movies) {
        commit('setMovies', movies);
    }
};
