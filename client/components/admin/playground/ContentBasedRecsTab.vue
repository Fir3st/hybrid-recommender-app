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
                    <p class="mt-2 mb-2">Selected movie for content-based recs: {{ selectedMovie.title || '' }} (ID: {{ selectedMovie.id }})</p>
                    <p>Relevant: {{ relevantCount }}</p>
                    <p>Not relevant: {{ notRelevantCount }}</p>
                    <p>Precision: {{ precision }}</p>
                    <p>Recall (TOP 10): {{ recall10 }}</p>
                    <p>F1-Measure (TOP 10): {{ f1Measure10 }}</p>
                    <p>Recall (TOP 15): {{ recall15 }}</p>
                    <p>F1-Measure (TOP 15): {{ f1Measure15 }}</p>
                    <MoviesTable :recommendations="recommendations" />
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import Loading from '~/components/default/search/Loading';
    import MoviesTable from '~/components/admin/movies/RecommendedMoviesTable';
    import * as _ from 'lodash';

    export default {
        components: {
            MoviesTable,
            Loading
        },
        data() {
            return {
                loading: false,
                take: 25,
                userId: 1,
                movieId: 1,
                selectedMovie: null,
                selectedAlg: 'tf-idf',
                orderBy: 'similarity',
                recommendations: [],
                genres: [],
                relevantCount: null,
                notRelevantCount: null,
                precision: null,
                recall10: null,
                recall15: null,
                f1Measure10: null,
                f1Measure15: null
            };
        },
        computed: {
            isButtonDisabled() {
                return (this.take < 1) ||
                    (this.movieId < 1) ||
                    (this.selectedAlg === null) ||
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
            async showRecommendations() {
                this.recommendations = [];

                try {
                    await this.analyzeUser();
                    this.loading = true;
                    const user = await this.$axios.$get(`/users/${this.userId}`);
                    const movies = user.ratings.map((item) => {
                        return {
                            ...item.movie,
                            rating: item.rating
                        };
                    });

                    const highestRatedItems = movies.filter(item => item.rating === Math.max(...movies.map(movie => movie.rating)));
                    if (highestRatedItems.length === 1) {
                        this.selectedMovie = highestRatedItems[0];
                        this.movieId = highestRatedItems[0].id;
                    } else {
                        const index = _.random(0, highestRatedItems.length - 1);
                        this.selectedMovie = highestRatedItems[index];
                        this.movieId = highestRatedItems[index].id;
                    }

                    let url = `/playground/movies/${this.movieId}?take=${this.take}`;

                    if (this.selectedAlg) {
                        url = `${url}&type=${this.selectedAlg}`;
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
