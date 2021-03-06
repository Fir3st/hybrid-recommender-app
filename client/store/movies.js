export const state = () => ({
    movies: [],
    topMovies: [],
    count: 0,
    take: 50,
    skip: 0,
    currentPage: 1,
    type: 'all',
    genre: null,
    orderBy: 'id',
    order: 'ASC'
});

export const getters = {
    movies (state) {
        return state.movies;
    },
    topMovies (state) {
        return state.topMovies;
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
    currentPage(state) {
        return state.currentPage;
    },
    type (state) {
        return state.type;
    },
    genre (state) {
        return state.genre;
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
    setTopMovies (state, movies) {
        state.topMovies = movies;
    },
    setCount (state, count) {
        state.count = count;
    },
    setSkip(state, skip) {
        state.skip = skip;
    },
    setCurrentPage(state, skip) {
        state.currentPage = skip;
    },
    setType(state, type) {
        state.type = type;
    },
    setGenre(state, genre) {
        state.genre = genre;
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
            let url = `/movies?take=${state.take}&skip=${state.skip}&type=${state.type}&orderBy=${state.orderBy}&order=${state.order}`;
            if (state.genre) {
                url = `${url}&genre=${state.genre}`;
            }
            const movies = await this.$axios.$get(url);

            if (movies && movies.length > 0) {
                commit('setMovies', movies);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    async setTopMovies({ commit, state }) {
        try {
            const url = `/movies/top?limit=5&type=${state.type}`;
            const movies = await this.$axios.$get(url);

            if (movies && movies.length > 0) {
                commit('setTopMovies', movies);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    async setCount({ commit, state }) {
        try {
            let url = `/movies/count/${state.type}`;
            if (state.genre) {
                url = `${url}?genre=${state.genre}`;
            }
            const moviesCount = await this.$axios.$get(url);

            if (moviesCount) {
                commit('setCount', moviesCount.count);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    setSkip({ commit, dispatch }, skip) {
        commit('setSkip', skip);
    },
    setCurrentPage({ commit, dispatch }, currentPage) {
        commit('setCurrentPage', currentPage);
    },
    setType({ commit }, type) {
        commit('setType', type);
    },
    setGenre({ commit }, genre) {
        commit('setGenre', genre);
    },
    setOrderBy({ commit }, orderBy) {
        commit('setOrderBy', orderBy);
    },
    setOrder({ commit }, order) {
        commit('setOrder', order);
    },
    async setPagination({ dispatch, state }, currentPage) {
        await dispatch('setCurrentPage', currentPage);
        await dispatch('setSkip', state.take * (currentPage - 1));
    },
    async loadMovies({ dispatch }, params = { genre: null, type: 'all', orderBy: 'year', order: 'DESC' }) {
        await dispatch('setGenre', params.genre);
        await dispatch('setType', params.type);
        await dispatch('setOrderBy', params.orderBy);
        await dispatch('setOrder', params.order);
        await dispatch('setMovies');
        await dispatch('setTopMovies');
        await dispatch('setCount');
    }
};
