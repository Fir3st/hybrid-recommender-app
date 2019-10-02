<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Hybrid recommendations</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form @submit.prevent="showRecommendations">
                        <b-form-group
                            id="userId"
                            label="User's ID"
                            label-for="userId"
                        >
                            <b-form-input
                                id="userId"
                                v-model="userId"
                                type="number"
                                min="1"
                                required
                                placeholder="Enter user's ID"
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group
                            id="movieId"
                            label="Movie's ID"
                            label-for="movieId"
                        >
                            <b-form-input
                                id="movieId"
                                v-model="movieId"
                                type="number"
                                min="1"
                                required
                                placeholder="Enter movie's ID"
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
                        <b-form-group
                            id="hybridType"
                            label="Hybrid algorithm"
                            label-for="hybridType"
                        >
                            <b-form-select
                                id="hybridType"
                                v-model="hybridType"
                                :options="hybridTypes"
                            ></b-form-select>
                        </b-form-group>
                        <b-form-group
                            id="recommenderType"
                            label="Collaborative filtering algorithm"
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
                            label="Similarity function for collaborative filtering"
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
                            label="Content-based algorithm (for similarity between items)"
                            label-for="similaritySource"
                        >
                            <b-form-select
                                id="similaritySource"
                                v-model="similaritySource"
                                :options="similaritySources"
                            ></b-form-select>
                        </b-form-group>
                        <b-form-group
                            id="genre"
                            label="Specific genre (optional)"
                            label-for="genre"
                        >
                            <b-form-select
                                id="genre"
                                v-model="genre"
                                :options="genres"
                            ></b-form-select>
                        </b-form-group>
                        <b-form-group
                            id="movieType"
                            label="Specific movie type (optional)"
                            label-for="movieType"
                        >
                            <b-form-select
                                id="movieType"
                                v-model="movieType"
                                :options="movieTypes"
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
                    <MoviesTable :recommendations="recommendations" />
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MoviesTable from '~/components/admin/playground/HybridMoviesTable';
    import Loading from '~/components/default/search/Loading';

    export default {
        components: {
            MoviesTable,
            Loading
        },
        data() {
            return {
                loading: false,
                take: 10,
                userId: 1,
                movieId: 1,
                hybridType: null,
                hybridTypes: [
                    { value: null, text: 'Please select a hybrid hype' },
                    { value: 'weighted', text: 'Weighted' },
                    { value: 'switched', text: 'Switched' }
                ],
                recommenderType: null,
                recommenderTypes: [
                    { value: null, text: 'Please select a collaborative algorithm' },
                    { value: 'svd', text: 'Single Value Decomposition (default)' },
                    { value: 'item-based', text: 'Item-based approach' },
                    { value: 'user-based', text: 'User-based approach' }
                ],
                similarityType: null,
                similarityTypes: [
                    { value: null, text: 'Please select a similarity function for collaborative filtering' },
                    { value: 'cosine', text: 'Cosine' },
                    { value: 'jaccard', text: 'Jaccard' },
                    { value: 'euclidean', text: 'Euclidean' }
                ],
                similaritySource: null,
                similaritySources: [
                    { value: null, text: 'Please select a content-based algorithm' },
                    { value: 'tf-idf', text: 'TF-IDF (default)' },
                    { value: 'lda', text: 'LDA' },
                ],
                genre: null,
                movieType: null,
                movieTypes:  [
                    { value: null, text: 'Please select a movie type' },
                    { value: 'movie', text: 'Movie' },
                    { value: 'series', text: 'Series' },
                ],
                recommendations: []
            };
        },
        computed: {
            ...mapGetters({
                allGenres: 'genres/genres'
            }),
            genres() {
                const genres = this.allGenres.filter(item => item.name !== 'N/A');
                const options = genres.map((item) => {
                    return { value: item.id, text: item.name };
                });

                return [
                    { value: null, text: 'Please select a genre' },
                    ...options
                ];
            },
            isButtonDisabled() {
                return (this.take < 1)
                    || (this.userId < 1)
                    || (this.movieId < 1)
                    || (this.hybridType === null)
                    || (this.recommenderType === null)
                    || (this.similaritySource === null);
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
                    let url = `/playground/hybrid/${this.userId}/${this.movieId}?take=${this.take}`;

                    if (this.hybridType) {
                        url = `${url}&hybrid_type=${this.hybridType}`;
                    }
                    if (this.recommenderType) {
                        url = `${url}&rec_type=${this.recommenderType}`;
                    }
                    if (this.similarityType) {
                        url = `${url}&sim_type=${this.similarityType}`;
                    }
                    if (this.similaritySource) {
                        url = `${url}&sim_source=${this.similaritySource}`;
                    }
                    if (this.movieType) {
                        url = `${url}&type=${this.movieType}`;
                    }
                    if (this.genre) {
                        url = `${url}&genres=${this.genre}`;
                    }

                    const response = await this.$axios.$get(url);
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
                        predicted_rating: ('rating' in item && typeof item.rating !== 'string') ? item.rating : '-',
                        average_rating: item.avgRating,
                        count: parseInt(item.ratingsCount, 10),
                        penalized: parseInt(item.penalized, 10),
                        rated_similarity: ('ratedSimilarity' in item) ? item.ratedSimilarity : '-',
                        similarity: ('similarity' in item) ? item.similarity : '-',
                        es_score: item.esScore || 0
                    };
                });

                this.downloadCSV(recs, `recommendations_hybrid_user_${this.userId}_movie_${this.movieId}.csv`);
            }
        }
    };
</script>

<style lang="sass">
    h2
        margin: 20px 0
</style>
