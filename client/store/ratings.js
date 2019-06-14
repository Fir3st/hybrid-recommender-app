export const state = () => ({
    ratings: [],
    count: 0,
    valuesDistribution: [],
    frequencyDistribution: []
});

export const getters = {
    ratings (state) {
        return state.ratings;
    },
    count (state) {
        return state.count;
    },
    valuesDistribution (state) {
        return state.valuesDistribution;
    },
    frequencyDistribution (state) {
        return state.frequencyDistribution;
    }
};

export const mutations = {
    setRatings (state, ratings) {
        state.ratings = ratings;
    },
    setCount (state, count) {
        state.count = count;
    },
    setValuesDistribution (state, distribution) {
        state.valuesDistribution = distribution;
    },
    setFrequencyDistribution (state, distribution) {
        state.frequencyDistribution = distribution;
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
    async setValuesDistribution({ commit }) {
        try {
            const url = `/analytics/ratings-values-distribution`;
            const ratingsDistribution = await this.$axios.$get(url);

            if (ratingsDistribution && ratingsDistribution.length > 0) {
                commit('setValuesDistribution', ratingsDistribution);
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    async setFrequencyDistribution({ commit }) {
        try {
            const url = `/analytics/ratings-distribution`;
            const ratingsDistribution = await this.$axios.$get(url);

            if (ratingsDistribution && ratingsDistribution.length > 0) {
                commit('setFrequencyDistribution', ratingsDistribution);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
};
