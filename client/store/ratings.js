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
    async setRatings({ commit }) {
        try {
            const url = '/ratings';
            const ratings = await this.$axios.$get(url);

            if (ratings && ratings.length > 0) {
                commit('setRatings', ratings);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    async setCount({ commit }) {
        try {
            const url = '/ratings/count';
            const ratingsCount = await this.$axios.$get(url);

            if (ratingsCount) {
                commit('setCount', ratingsCount.count);
            }
        } catch (error) {
            console.log(error.message);
        }
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
