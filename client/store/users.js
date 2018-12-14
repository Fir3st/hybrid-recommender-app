export const state = () => ({
    users: [],
    count: 0,
    take: 50,
    skip: 0
});

export const getters = {
    users (state) {
        return state.users;
    },
    count (state) {
        return state.count;
    },
    take (state) {
        return state.take;
    },
    skip (state) {
        return state.skip;
    }
};

export const mutations = {
    setUsers (state, users) {
        state.users = users;
    },
    setCount (state, count) {
        state.count = count;
    },
    setSkip(state, skip) {
        state.skip = skip;
    }
};

export const actions = {
    async setUsers({ commit, state }) {
        try {
            const users = await this.$axios.$get(`/users?take=${state.take}&skip=${state.skip}`);

            if (users && users.length > 0) {
                commit('setUsers', users);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    async setCount({ commit }) {
        try {
            const usersCount = await this.$axios.$get(`/users/count`);

            if (usersCount) {
                commit('setCount', usersCount.count);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    setSkip({ commit, dispatch }, skip) {
        commit('setSkip', skip);
        dispatch('setUsers');
    }
};
