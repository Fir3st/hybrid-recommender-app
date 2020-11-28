<template>
    <b-row>
        <b-col>
            <h3>Results for individual systems</h3>
            <b-row v-if="isGeneralSettingsFilled">
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
                            title="Cluster system results"
                            active
                        >
                            <Tab
                                :recommendations="clusterResults"
                                rec-type="clusterResults"
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
                        <b-tab
                            title="Content-based results"
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
                clusterResults: [],
                timeout: 60 * 40 * 1000
            };
        },
        computed: {
            isGeneralSettingsFilled() {
                return this.settings.movieId !== null && this.settings.take > 0;
            },
            hasResults() {
                return this.cbResults.length > 0
                    && this.cbfResults.length > 0
                    && this.hybridResults.length > 0
                    && this.expertResults.length > 0
                    && this.clusterResults.length > 0;
            },
            isFilled() {
                const cbFilled = this.cbResults.every(item => item.relevance !== null);
                const cbfFilled = this.cbfResults.every(item => item.relevance !== null);
                const hybridFilled = this.hybridResults.every(item => item.relevance !== null);
                const expertFilled = this.expertResults.every(item => item.relevance !== null);
                const clusterFilled = this.clusterResults.every(item => item.relevance !== null);

                return this.hasResults && cbFilled && cbfFilled && hybridFilled && expertFilled && clusterFilled;
            }
        },
        methods: {
            resetState() {
                this.cbResults = [];
                this.cbfResults = [];
                this.hybridResults = [];
                this.expertResults = [];
                this.clusterResults = [];
            },
            async showResults() {
                this.resetState();
                this.loading = true;
                try {
                    await this.getCBResults();
                    await this.getCBFResults();
                    await this.getHybridResults();
                    await this.getExpertResults();
                    await this.getClusterResults();
                } catch (error) {
                    console.log(error.message);
                } finally {
                    this.loading = false;
                }
            },
            async getCBResults() {
                let url = `/playground/movies/${this.settings.movieId}?take=${this.settings.take}`;
                url = `${url}&type=tf-idf`;
                url = `${url}&order_by=similarity`;

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
                let url = `/playground/users/${this.$auth.user.id}?take=${this.settings.take}`;
                url = `${url}&rec_type=svd`;
                url = `${url}&sim_source=tf-idf`;
                url = `${url}&order_by=rating`;

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
                let url = `/playground/hybrid/${this.$auth.user.id}/${this.settings.movieId}?take=${this.settings.take}`;
                url = `${url}&hybrid_type=weighted`;
                url = `${url}&rec_type=svd`;
                url = `${url}&sim_type=tf-idf`;
                url = `${url}&order_by=similarity,rating`;

                const response = await this.$axios.$get(url, { timeout: this.timeout });
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
                let url = `/playground/users/${this.$auth.user.id}?take=${this.settings.take}`;
                url = `${url}&rec_type=svd`;
                url = `${url}&sim_type=tf-idf`;
                url = `${url}&order_by=augmented_rating`;
                url = `${url}&fav_genres=${this.favouriteGenres.join(',')}`;
                url = `${url}&not_fav_genres=${this.notFavouriteGenres.join(',')}`;

                const response = await this.$axios.$get(url, { timeout: this.timeout });
                if (response && response.length > 0) {
                    this.expertResults = response.map((item) => {
                        return {
                            ...item,
                            relevance: null
                        };
                    });
                }
            },
            async getClusterResults() {
                let url = `/playground/users/${this.$auth.user.id}/new?take=${this.settings.take}`;

                const response = await this.$axios.$get(url, { timeout: this.timeout });
                if (response && response.length > 0) {
                    this.clusterResults = response.map((item) => {
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
                        items: this.movies
                    },
                    results: {
                        cbResults: this.cbResults,
                        cbfResults: this.cbfResults,
                        hybridResults: this.hybridResults,
                        expertResults: this.expertResults,
                        clusterResults: this.clusterResults
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
