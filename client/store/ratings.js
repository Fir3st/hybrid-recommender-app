export const state = () => ({
    ratings: [],
    count: 0,
    distribution: []
});

export const getters = {
    ratings (state) {
        return state.ratings;
    },
    count (state) {
        return state.count;
    },
    distribution (state) {
        return state.distribution;
    }
};

export const mutations = {
    setRatings (state, ratings) {
        state.ratings = ratings;
    },
    setCount (state, count) {
        state.count = count;
    },
    setDistribution (state, distribution) {
        state.distribution = distribution;
    }
};

export const actions = {
    async setRatings({ commit, state }) {
        // TODO: Get all ratings
    },
    async setCount({ commit, state }) {
        // TODO: Get count of ratings
    },
    async setRatingsDistribution({ commit }) {
        try {
            const url = `/analytics/ratings-distribution`;
            const ratingsDistribution = await this.$axios.$get(url);

            if (ratingsDistribution && ratingsDistribution.length > 0) {
                commit('setDistribution', ratingsDistribution);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
};
