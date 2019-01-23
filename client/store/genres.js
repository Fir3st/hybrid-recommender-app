export const state = () => ({
    moviesGenres: [],
    seriesGenres: []
});

export const getters = {
    moviesGenres(state) {
        return state.moviesGenres;
    },
    seriesGenres(state) {
        return state.seriesGenres;
    }
};

export const mutations = {
    setMoviesGenres(state, items) {
        state.moviesGenres = items;
    },
    setSeriesGenres(state, items) {
        state.seriesGenres = items;
    }
};

export const actions = {
    async setMoviesGenres({ commit }) {
        try {
            const url = `/genres?type=movie`;
            const moviesGenres = await this.$axios.$get(url);

            if (moviesGenres && moviesGenres.length > 0) {
                commit('setMoviesGenres', moviesGenres);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    async setSeriesGenres({ commit }) {
        try {
            const url = `/genres?type=series`;
            const seriesGenres = await this.$axios.$get(url);

            if (seriesGenres && seriesGenres.length > 0) {
                commit('setSeriesGenres', seriesGenres);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
};
