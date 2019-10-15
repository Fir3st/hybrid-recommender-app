<template>
    <b-row>
        <b-col>
            <h3>Results for individual systems</h3>
            <b-row v-if="isGeneralSettingsFilled && isCBSettingsFilled && isCBFSettingsFilled && isHybridSettingsFilled && isESSettingsFilled">
                <b-col class="text-center">
                    <b-button
                        variant="info"
                        :disabled="loading"
                        @click="showResults"
                    >
                        {{ !hasResults ? 'Compute results' : 'Re-compute results' }}
                    </b-button>
                    <b-button
                        variant="info"
                        :disabled="!isFilled"
                        @click="submit"
                    >
                        Send
                    </b-button>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col>
                    <p>Some settings are not completed. Please fill all required inputs.</p>
                </b-col>
            </b-row>
            <Loading v-if="loading" />
            <b-row v-if="hasResults">
                <b-col>
                    <b-tabs class="results">
                        <b-tab
                            title="Content-based results"
                            active
                        >
                            <Tab
                                :recommendations="cbResults"
                                rec-type="cbResults"
                                :set-relevance-handler="setRelevance"
                            />
                        </b-tab>
                        <b-tab
                            title="Collaborative results"
                        >
                            <Tab
                                :recommendations="cbfResults"
                                rec-type="cbfResults"
                                :set-relevance-handler="setRelevance"
                            />
                        </b-tab>
                        <b-tab
                            title="Hybrid results"
                        >
                            <Tab
                                :recommendations="hybridResults"
                                rec-type="hybridResults"
                                :set-relevance-handler="setRelevance"
                            />
                        </b-tab>
                        <b-tab
                            title="Expert system results"
                        >
                            <Tab
                                :recommendations="expertResults"
                                rec-type="expertResults"
                                :set-relevance-handler="setRelevance"
                            />
                        </b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import Loading from '~/components/default/search/Loading';
    import Tab from './Tab';

    export default {
        components: {
            Loading,
            Tab
        },
        props: {
            settings: {
                type: Object,
                required: true
            },
            movies: {
                type: Array,
                required: true
            },
            favouriteGenres: {
                type: Array,
                required: true
            },
            notFavouriteGenres: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                loading: false,
                cbResults: [],
                cbfResults: [],
                hybridResults: [],
                expertResults: [],
                timeout: 60 * 40 * 1000
            };
        },
        computed: {
            isGeneralSettingsFilled() {
                return this.settings.general.movieId !== null && this.settings.general.take > 0;
            },
            isCBSettingsFilled() {
                return this.settings.cb.recType !== null && this.settings.cb.orderBy !== null;
            },
            isCBFSettingsFilled() {
                return this.settings.cbf.recType !== null
                    && this.settings.cbf.similaritySource !== null
                    && this.settings.cb.orderBy !== null;
            },
            isHybridSettingsFilled() {
                return this.settings.hybrid.hybridType !== null
                    && this.settings.hybrid.recType !== null
                    && this.settings.hybrid.similaritySource !== null
                    && this.settings.hybrid.orderBy !== null;
            },
            isESSettingsFilled() {
                return this.settings.expert.recType !== null
                    && this.settings.expert.similaritySource !== null
                    && this.settings.expert.orderBy !== null;
            },
            hasResults() {
                return this.cbResults.length > 0
                    && this.cbfResults.length > 0
                    && this.hybridResults.length > 0
                    && this.expertResults.length > 0;
            },
            isFilled() {
                const cbFilled = this.cbResults.every(item => item.relevance !== null);
                const cbfFilled = this.cbfResults.every(item => item.relevance !== null);
                const hybridFilled = this.hybridResults.every(item => item.relevance !== null);
                const expertFilled = this.expertResults.every(item => item.relevance !== null);

                return this.hasResults && cbFilled && cbfFilled && hybridFilled && expertFilled;
            }
        },
        methods: {
            resetState() {
                this.cbResults = [];
                this.cbfResults = [];
                this.hybridResults = [];
                this.expertResults = [];
            },
            async showResults() {
                this.resetState();
                this.loading = true;
                try {
                    await this.getCBResults();
                    await this.getCBFResults();
                    await this.getHybridResults();
                    await this.getExpertResults();
                } catch (error) {
                    console.log(error.message);
                } finally {
                    this.loading = false;
                }
            },
            async getCBResults() {
                let url = `/playground/movies/${this.settings.general.movieId}?take=${this.settings.general.take}`;

                if (this.settings.cb.recType) {
                    url = `${url}&type=${this.settings.cb.recType}`;
                }

                if (this.settings.cb.orderBy) {
                    url = `${url}&order_by=${this.settings.cb.orderBy}`;
                }

                const response = await this.$axios.$get(url, { timeout: this.timeout });
                if (response && response.length > 0) {
                    this.cbResults = response.map((item) => {
                        return {
                            ...item,
                            relevance: null
                        };
                    });
                }
            },
            async getCBFResults() {
                let url = `/playground/users/${this.$auth.user.id}?take=${this.settings.general.take}`;

                if (this.settings.cbf.recType) {
                    url = `${url}&rec_type=${this.settings.cbf.recType}`;
                }
                if (this.settings.cbf.similarityType) {
                    url = `${url}&sim_type=${this.settings.cbf.similarityType}`;
                }
                if (this.settings.cbf.similaritySource) {
                    url = `${url}&sim_source=${this.settings.cbf.similaritySource}`;
                }
                if (this.settings.cbf.movieType) {
                    url = `${url}&type=${this.settings.cbf.movieType}`;
                }
                if (this.settings.cbf.genre.length > 0) {
                    url = `${url}&genres=${this.settings.cbf.genre.join(',')}`;
                }

                if (this.settings.cbf.orderBy) {
                    url = `${url}&order_by=${this.settings.cbf.orderBy}`;
                }

                const response = await this.$axios.$get(url, { timeout: this.timeout });
                if (response && response.length > 0) {
                    this.cbfResults = response.map((item) => {
                        return {
                            ...item,
                            relevance: null
                        };
                    });
                }
            },
            async getHybridResults() {
                let url = `/playground/hybrid/${this.$auth.user.id}/${this.settings.general.movieId}?take=${this.settings.general.take}`;

                if (this.settings.hybrid.hybridType) {
                    url = `${url}&hybrid_type=${this.settings.hybrid.hybridType}`;
                }
                if (this.settings.hybrid.recType) {
                    url = `${url}&rec_type=${this.settings.hybrid.recType}`;
                }
                if (this.settings.hybrid.similarityType) {
                    url = `${url}&sim_type=${this.settings.hybrid.similarityType}`;
                }
                if (this.settings.hybrid.similaritySource) {
                    url = `${url}&sim_source=${this.settings.hybrid.similaritySource}`;
                }
                if (this.settings.hybrid.movieType) {
                    url = `${url}&type=${this.settings.hybrid.movieType}`;
                }
                if (this.settings.hybrid.genre.length > 0) {
                    url = `${url}&genres=${this.settings.hybrid.genre.join(',')}`;
                }
                if (this.settings.hybrid.orderBy) {
                    url = `${url}&order_by=${this.settings.hybrid.orderBy}`;
                }

                const response = await this.$axios.$get(url, this.timeout);
                if (response && response.length > 0) {
                    this.hybridResults = response.map((item) => {
                        return {
                            ...item,
                            relevance: null
                        };
                    });
                }
            },
            async getExpertResults() {
                let url = `/playground/users/${this.$auth.user.id}?take=${this.settings.general.take}`;

                if (this.settings.expert.recType) {
                    url = `${url}&rec_type=${this.settings.expert.recType}`;
                }
                if (this.settings.expert.similarityType) {
                    url = `${url}&sim_type=${this.settings.expert.similarityType}`;
                }
                if (this.settings.expert.similaritySource) {
                    url = `${url}&sim_source=${this.settings.expert.similaritySource}`;
                }
                if (this.settings.expert.movieType) {
                    url = `${url}&type=${this.settings.expert.movieType}`;
                }
                if (this.settings.expert.genre.length > 0) {
                    url = `${url}&genres=${this.settings.expert.genre.join(',')}`;
                }

                if (this.settings.expert.orderBy) {
                    url = `${url}&order_by=${this.settings.expert.orderBy}`;
                }
                if (this.favouriteGenres) {
                    url = `${url}&fav_genres=${this.favouriteGenres.join(',')}`;
                }
                if (this.notFavouriteGenres) {
                    url = `${url}&not_fav_genres=${this.notFavouriteGenres.join(',')}`;
                }

                const response = await this.$axios.$get(url, this.timeout);
                if (response && response.length > 0) {
                    this.expertResults = response.map((item) => {
                        return {
                            ...item,
                            relevance: null
                        };
                    });
                }
            },
            setRelevance(type, id, relevance) {
                const movieIndex = this[type].findIndex(item => item.id === id);
                if (movieIndex > -1) {
                    this[type][movieIndex].relevance = relevance;
                }
            },
            async submit() {
                const data = {
                    user: {
                        id: this.$auth.user.id,
                        items: this.movies,
                        favouriteGenres: this.favouriteGenres,
                        notFavouriteGenres: this.notFavouriteGenres
                    },
                    settings: this.settings,
                    results: {
                        cbResults: this.cbResults.map((item) => {
                            return {
                                id: item.id,
                                title: item.title,
                                relevance: item.relevance
                            };
                        }),
                        cbfResults: this.cbfResults.map((item) => {
                            return {
                                id: item.id,
                                title: item.title,
                                relevance: item.relevance
                            };
                        }),
                        hybridResults: this.hybridResults.map((item) => {
                            return {
                                id: item.id,
                                title: item.title,
                                relevance: item.relevance
                            };
                        }),
                        expertResults: this.expertResults.map((item) => {
                            return {
                                id: item.id,
                                title: item.title,
                                relevance: item.relevance
                            };
                        })
                    }
                };
                try {
                    await this.$axios.$post(`/users/${this.$auth.user.id}/results`, data);
                    this.$notify({
                        title: 'Success',
                        message: `You have successfully sent the results.`,
                        type: 'success',
                        position: 'bottom-right'
                    });
                } catch (error) {
                    console.log(error.message);
                    this.$notify({
                        title: 'Error',
                        message: `Something went wrong with sending the results. Please try it again.`,
                        type: 'error',
                        position: 'bottom-right'
                    });
                }
            }
        }
    };
</script>

<style lang="sass" scoped>
    h3
        margin-bottom: 20px
    .results
        margin-top: 40px
</style>
