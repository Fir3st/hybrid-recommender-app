export const state = () => ({
    movies: [],
    count: 0,
    take: 50,
    skip: 0,
    type: 'all',
    orderBy: 'id',
    order: 'ASC'
});

export const getters = {
    movies (state) {
        return state.movies;
    },
    count (state) {
        return state.count;
    },
    take (state) {
        return state.take;
    },
    skip (state) {
        return state.skip;
    },
    type (state) {
        return state.type;
    },
    orderBy(state) {
        return state.orderBy;
    },
    order(state) {
        return state.order;
    }
};

export const mutations = {
    setMovies (state, movies) {
        state.movies = movies;
    },
    setCount (state, count) {
        state.count = count;
    },
    setSkip(state, skip) {
        state.skip = skip;
    },
    setType(state, type) {
        state.type = type;
    },
    setOrderBy(state, orderBy) {
        state.orderBy = orderBy;
    },
    setOrder(state, order) {
        state.order = order;
    }
};

export const actions = {
    async setMovies({ commit, state }) {
        try {
            const url = `/movies?take=${state.take}&skip=${state.skip}&type=${state.type}&orderBy=${state.orderBy}&order=${state.order}`;
            const movies = await this.$axios.$get(url);

            if (movies && movies.length > 0) {
                commit('setMovies', movies);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    async setCount({ commit, state }) {
        try {
            const moviesCount = await this.$axios.$get(`/movies/count/${state.type}`);

            if (moviesCount) {
                commit('setCount', moviesCount.count);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    setSkip({ commit, dispatch }, skip) {
        commit('setSkip', skip);
        dispatch('setMovies');
    },
    setType({ commit }, type) {
        commit('setType', type);
    },
    setOrderBy({ commit }, orderBy) {
        commit('setOrderBy', orderBy);
    },
    setOrder({ commit }, order) {
        commit('setOrder', order);
    }
};
