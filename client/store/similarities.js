export const state = () => ({
    distribution: []
});

export const getters = {
    distribution (state) {
        return state.distribution;
    }
};

export const mutations = {
    setDistribution (state, distribution) {
        state.distribution = distribution;
    }
};

export const actions = {
    async setDistributions({ commit }) {
        try {
            const url = `/analytics/similarities-distribution`;
            const distributions = await this.$axios.$get(url);

            if (distributions && distributions.length > 0) {
                commit('setDistribution', distributions);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
};
