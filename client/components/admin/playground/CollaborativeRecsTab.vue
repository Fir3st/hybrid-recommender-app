<template>
    <b-row>
        <b-col>
            <b-row class="mt-2">
                <b-col>
                    <b-button @click="getMassData">
                        Get mass generated data
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h2>Collaborative recommendations</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form @submit.prevent="showRecommendations">
                        <b-form-group
                            id="id"
                            label="User's ID"
                            label-for="id"
                        >
                            <b-form-input
                                id="id"
                                v-model="userId"
                                type="number"
                                min="1"
                                required
                                placeholder="Enter user's ID"
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group
                            id="take"
                            label="Number of results"
                            label-for="take"
                        >
                            <b-form-input
                                id="take"
                                v-model="take"
                                type="number"
                                min="1"
                                required
                                placeholder="Enter number of results"
                            ></b-form-input>
                        </b-form-group>
                        <b-form-select
                            v-model="relevantAlgorithm"
                            :options="relevantOptions"
                            class="mt-2 mb-2"
                        />
                        <b-button
                            :disabled="isButtonDisabled"
                            type="submit"
                            variant="primary"
                        >
                            Show recommendations
                        </b-button>
                        <b-button
                            v-if="recommendations.length"
                            variant="primary"
                            @click="downloadRecommendations"
                        >
                            Download as CSV
                        </b-button>
                    </b-form>
                </b-col>
            </b-row>
            <Loading v-if="loading" />
            <b-row v-if="recommendations.length && !loading">
                <b-col>
                    <p>Relevant: {{ relevantCount }}</p>
                    <p>Not relevant: {{ notRelevantCount }}</p>
                    <p>Precision: {{ precision }}</p>
                    <p>Recall (TOP 10): {{ recall10 }}</p>
                    <p>F1-Measure (TOP 10): {{ f1Measure10 }}</p>
                    <p>Recall (TOP 15): {{ recall15 }}</p>
                    <p>F1-Measure (TOP 15): {{ f1Measure15 }}</p>
                    <b-table striped hover :items="recommendations" :fields="moviesFields">
                        <template v-slot:cell(#)="data">{{ data.index + 1 }}</template>
                        <template v-slot:cell(genres)="data">{{ data.item.genres.map(item => item.name).join(', ') }}</template>
                    </b-table>
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
        data() {
            return {
                loading: false,
                userId: 1,
                recommenderType: 'svd',
                similaritySource: 'tf-idf',
                orderBy: 'rating',
                recommendations: [],
                moviesFields: [
                    '#',
                    { key: 'id', label: 'ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'genres', label: 'Genres' },
                    { key: 'rating', label: 'Rating' },
                    { key: 'ratedSimilarity', label: 'Similarity' },
                    { key: 'relevant', label: 'Relevant' }
                ],
                currentTab: 'cbf',
            };
        },
        computed: {
            isButtonDisabled() {
                return (this.take < 1) ||
                    (this.userId < 1) ||
                    (this.recommenderType === null) ||
                    (this.similaritySource === null) ||
                    (this.orderBy === null);
            }
        },
        methods: {
            async analyzeUser() {
                this.loading = true;
                this.recommendations = [];

                try {
                    const url = `/users/${this.userId}/analyze`;

                    const response = await this.$axios.$get(url);

                    if (response.genres && response.genres.length) {
                        this.genres = response.genres;
                    }
                } catch (error) {
                    console.log(error.message);
                } finally {
                    this.loading = false;
                }
            },
            resetSimilarity() {
                if (this.recommenderType === 'svd') {
                    this.similarityType = null;
                }
            },
            async showRecommendations() {
                this.recommendations = [];

                try {
                    await this.analyzeUser();
                    this.loading = true;
                    let url = `/playground/users/${this.userId}?take=${this.take}`;
                    if (this.recommenderType) {
                        url = `${url}&rec_type=${this.recommenderType}`;
                    }
                    if (this.similaritySource) {
                        url = `${url}&sim_source=${this.similaritySource}`;
                    }
                    if (this.orderBy) {
                        url = `${url}&order_by=${this.orderBy}`;
                    }
                    const response = await this.$axios.$get(url, { timeout: 60 * 40 * 1000 });
                    if (response && response.length > 0) {
                        this.recommendations = response;
                        const relevance = this.getRelevance(this.recommendations, this.mostRatedGenresAll, this.leastRatedGenresAll);
                        this.relevantCount = this.getRelevantCount(relevance);
                        this.notRelevantCount = this.take - this.relevantCount;
                        this.precision = this.getFinalScore(this.take, this.relevantCount);
                        this.recall10 = this.getRecallScore(relevance, 10);
                        this.recall15 = this.getRecallScore(relevance, 15);
                        this.f1Measure10 = this.getFMeasureScore(relevance, this.take, 10);
                        this.f1Measure15 = this.getFMeasureScore(relevance, this.take, 15);
                        this.recommendations = this.recommendations.map((movie) => {
                            const relevanceForItem = relevance.find(item => item.id === movie.id);

                            return { ...movie, relevant: relevanceForItem ? relevanceForItem.relevant : null };
                        });
                    }
                } catch (error) {
                    console.log(error.message);
                } finally {
                    this.loading = false;
                }
            },
            async downloadRecommendations() {
                const recs = this.recommendations.map((item) => {
                    return {
                        id: item.id,
                        title: item.title,
                        predicted_rating: item.rating,
                        average_rating: item.avgRating,
                        count: parseInt(item.ratingsCount, 10),
                        penalized: parseInt(item.penalized, 10),
                        rated_similarity: item.ratedSimilarity || 0,
                        es_score: item.esScore || 0
                    };
                });
                this.downloadCSV(recs, `recommendations_user_${this.userId}.csv`);
            }
        }
    };
</script>

<style lang="sass">
    h2
        margin: 20px 0
</style>
