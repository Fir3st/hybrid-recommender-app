<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Search by query</h2>
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
                            id="query"
                            label="Query"
                            label-for="query"
                        >
                            <b-form-input
                                id="query"
                                v-model="query"
                                type="text"
                                required
                                placeholder="Enter the query"
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group
                            id="recommenderType"
                            label="Recommender algorithm"
                            label-for="recommenderType"
                        >
                            <b-form-select
                                id="recommenderType"
                                v-model="recommenderType"
                                :options="recommenderTypes"
                                @change="resetSimilarity"
                            ></b-form-select>
                        </b-form-group>
                        <b-form-group
                            id="similarityType"
                            label="Similarity function"
                            label-for="similarityType"
                        >
                            <b-form-select
                                id="similarityType"
                                v-model="similarityType"
                                :options="similarityTypes"
                                :disabled="recommenderType === 'svd'"
                            ></b-form-select>
                        </b-form-group>
                        <b-form-group
                            id="similaritySource"
                            label="Algorithm used for similarity with already rated movies"
                            label-for="similaritySource"
                        >
                            <b-form-select
                                id="similaritySource"
                                v-model="similaritySource"
                                :options="similaritySources"
                            ></b-form-select>
                        </b-form-group>
                        <b-form-group
                            id="orderBy"
                            label="Order by"
                            label-for="orderBy"
                        >
                            <b-form-select
                                id="orderBy"
                                v-model="orderBy"
                                :options="orderByOptions"
                            ></b-form-select>
                        </b-form-group>
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
                    <MoviesTable
                        :recommendations="recommendations"
                        :additional-info="true"
                    />
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import MoviesTable from '~/components/admin/users/RecommendedMoviesTable';
    import Loading from '~/components/default/search/Loading';

    export default {
        components: {
            MoviesTable,
            Loading
        },
        data() {
            return {
                loading: false,
                query: null,
                userId: 1,
                recommenderType: null,
                recommenderTypes: [
                    { value: null, text: 'Please select an algorithm' },
                    { value: 'svd', text: 'Single Value Decomposition (default)' },
                    { value: 'item-based', text: 'Item-based approach' },
                    { value: 'user-based', text: 'User-based approach' }
                ],
                similarityType: null,
                similarityTypes: [
                    { value: null, text: 'Please select a similarity function' },
                    { value: 'cosine', text: 'Cosine' },
                    { value: 'jaccard', text: 'Jaccard' },
                    { value: 'euclidean', text: 'Euclidean' }
                ],
                similaritySource: null,
                similaritySources: [
                    { value: null, text: 'Please select an algorithm' },
                    { value: 'tf-idf', text: 'TF-IDF (default)' },
                    { value: 'lda', text: 'LDA' },
                ],
                orderBy: null,
                orderByOptions: [
                    { value: null, text: 'Please select columns for sorting and their order' },
                    { value: 'rating', text: 'Only predicted rating' },
                    { value: 'es_score', text: 'Only Expert system score' },
                    { value: 'rating,es_score', text: 'Predicted rating, Expert system score (default)' },
                    { value: 'es_score,rating', text: 'Expert system score, Predicted rating' },
                ],
                recommendations: []
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
            resetSimilarity() {
                if (this.recommenderType === 'svd') {
                    this.similarityType = null;
                }
            },
            async showRecommendations() {
                this.recommendations = [];
                this.loading = true;

                try {
                    let url = `/playground/search/${this.userId}?query=${this.query}`;

                    if (this.recommenderType) {
                        url = `${url}&rec_type=${this.recommenderType}`;
                    }
                    if (this.similarityType) {
                        url = `${url}&sim_type=${this.similarityType}`;
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

                this.downloadCSV(recs, `search_user_${this.userId}_query.csv`);
            }
        }
    };
</script>

<style lang="sass">
    h2
        margin: 20px 0
</style>
