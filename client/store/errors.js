export const state = () => ({
    rolesError: null,
    projectError: null
});

export const getters = {
    rolesError (state) {
        return state.rolesError;
    },
    projectError (state) {
        return state.projectError;
    }
};

export const mutations = {
    setRolesError (state, error) {
        state.rolesError = error;
    },
    removeRolesError (state) {
        state.rolesError = null;
    },
    setProjectError (state, error) {
        state.projectError = error;
    },
    removeProjectError (state) {
        state.projectError = null;
    }
};

export const actions = {
    setRolesError({ commit }, error) {
        commit('setRolesError', error);
    },
    removeRolesError({ commit }) {
        commit('removeRolesError');
    },
    setProjectError ({ commit }, error) {
        commit('setProjectError', error);
    },
    removeProjectError ({ commit }) {
        commit('removeProjectError');
    }
};
