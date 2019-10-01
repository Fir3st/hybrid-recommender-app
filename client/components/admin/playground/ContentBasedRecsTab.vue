<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Content-Based recommendations</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form @submit.prevent="showRecommendations">
                        <b-form-group
                            id="id"
                            label="Movie's ID"
                            label-for="id"
                        >
                            <b-form-input
                                id="id"
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
                            id="algorithm"
                            label="Algorithm"
                            label-for="algorithm"
                        >
                            <b-form-select
                                id="algorithm"
                                v-model="selectedAlg"
                                :options="options"
                            ></b-form-select>
                        </b-form-group>
                        <b-button
                            :disabled="(take < 1) || (movieId < 1) || (selectedAlg === null)"
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
            <b-row v-if="recommendations.length">
                <b-col>
                    <MoviesTable :recommendations="recommendations" />
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import MoviesTable from '~/components/admin/movies/RecommendedMoviesTable';

    export default {
        components: {
            MoviesTable
        },
        data() {
            return {
                take: 10,
                movieId: 1,
                selectedAlg: null,
                options: [
                    { value: null, text: 'Please select an algorithm' },
                    { value: 'tf-idf', text: 'TF-IDF (default)' },
                    { value: 'lda', text: 'LDA' },
                ],
                recommendations: []
            };
        },
        methods: {
            async showRecommendations() {
                this.recommendations = [];
                try {
                    let url = `/playground/movies/${this.movieId}?take=${this.take}`;

                    if (this.selectedAlg) {
                        url = `${url}&type=${this.selectedAlg}`;
                    }

                    const response = await this.$axios.$get(url);
                    if (response && response.length > 0) {
                        this.recommendations = response;
                    }
                } catch (error) {
                    console.log(error.message);
                }
            },
            async downloadRecommendations() {
                const recs = this.recommendations.map((item) => {
                    return {
                        id: item.id,
                        title: item.title,
                        similarity: item.similarity || 0,
                        average_rating: item.avgRating,
                        count: parseInt(item.ratingsCount, 10),
                        penalized: parseInt(item.penalized, 10)
                    };
                });

                this.downloadCSV(recs, `recommendations_movie_${this.movieId}.csv`);
            }
        }
    };
</script>

<style lang="sass">
    h2
        margin: 20px 0
</style>
