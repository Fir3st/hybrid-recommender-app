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
                        Show results
                    </b-button>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col>
                    <p>Some settings are not filled. Please go back and fill required inputs.</p>
                </b-col>
            </b-row>
            <Loading v-if="loading" />
            <b-row v-if="hasResults">
                <b-col>
                    Results
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import Loading from '~/components/default/search/Loading';

    export default {
        components: {
            Loading
        },
        props: {
            settings: {
                type: Object,
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
                    this.cbResults = response;
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
                if (this.settings.cbf.genre) {
                    url = `${url}&genres=${this.settings.cbf.genre.join(',')}`;
                }

                if (this.settings.cbf.orderBy) {
                    url = `${url}&order_by=${this.settings.cbf.orderBy}`;
                }

                const response = await this.$axios.$get(url, { timeout: this.timeout });
                if (response && response.length > 0) {
                    this.cbfResults = response;
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
                if (this.settings.hybrid.genre) {
                    url = `${url}&genres=${this.settings.hybrid.genre.join(',')}`;
                }
                if (this.settings.hybrid.orderBy) {
                    url = `${url}&order_by=${this.settings.hybrid.orderBy}`;
                }

                const response = await this.$axios.$get(url, this.timeout);
                if (response && response.length > 0) {
                    this.hybridResults = response;
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
                if (this.settings.expert.genre) {
                    url = `${url}&genres=${this.genre.join(',')}`;
                }

                if (this.settings.expert.orderBy) {
                    url = `${url}&order_by=${this.settings.expert.orderBy}`;
                }

                const response = await this.$axios.$get(url, this.timeout);
                if (response && response.length > 0) {
                    this.expertResults = response;
                }
            }
        }
    };
</script>

<style lang="sass">
    h3
        margin-bottom: 20px
</style>
