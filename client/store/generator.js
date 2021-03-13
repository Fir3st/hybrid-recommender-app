export const state = () => ({
    isGenerating: false,
});

export const getters = {
    isGenerating (state) {
        return state.isGenerating;
    },
};

export const mutations = {
    setIsGenerating (state, status) {
        state.isGenerating = status;
    },
};

export const actions = {
    setIsGenerating({ commit }, status) {
        commit('setIsGenerating', status);
    },
};
