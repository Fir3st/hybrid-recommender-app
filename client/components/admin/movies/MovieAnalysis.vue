<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Rating statistics</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <p>Average rating is {{ Number.parseFloat(avgRating).toFixed(2) }}.</p>
                    <p>Movie was rated {{ ratings.length }} times.</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h2>Recommended movies</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-button
                        variant="info"
                        class="btn-download"
                        @click="downloadSimilaritiesCSV"
                    >
                        Download all similarities as CSV
                    </b-button>
                </b-col>
            </b-row>
            <RecommendedMoviesTable :recommendations="recommendations" />
            <b-row>
                <b-col>
                    <h2>Recommendations for specific algorithm</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-select
                        v-model="recType"
                        :options="recTypes"
                    ></b-form-select>
                </b-col>
            </b-row>
            <b-row v-if="recType !== null">
                <b-col>
                    <b-button
                        class="btn-rec"
                        variant="info"
                        @click="getCBRecommendations"
                    >
                        Show recommendations
                    </b-button>
                </b-col>
            </b-row>
            <RecommendedMoviesTable
                v-if="contentBasedRecs"
                :recommendations="contentBasedRecs"
            />
        </b-col>
    </b-row>
</template>

<script>
    import RecommendedMoviesTable from './RecommendedMoviesTable';

    export default {
        components: {
            RecommendedMoviesTable
        },
        props: {
            recommendations: {
                type: Array,
                required: true
            },
            ratings: {
                type: Array,
                required: true
            },
            avgRating: {
                type: Number,
                required: true
            },
            movie: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                recType: null,
                recTypes: [
                    { value: null, text: 'Select recommender type (LDA or TF-IDF)' },
                    { value: 'lda', text: 'LDA' },
                    { value: 'tf-idf', text: 'TF-IDF' }
                ],
                contentBasedRecs: null
            };
        },
        methods: {
            async getCBRecommendations() {
                this.contentBasedRecs =  null;
                try {
                    const url = `/movies/${this.movie.id}/recommendations?type=${this.recType}`;
                    const recommendations = await this.$axios.$get(url);

                    if (recommendations && recommendations.length > 0) {
                        this.contentBasedRecs = recommendations;
                    }
                } catch (error) {
                    console.log(error.message);
                }
            },
            async downloadSimilaritiesCSV() {
                try {
                    const url = `/movies/${this.movie.id}/recommendations?take=100`;
                    const response = await this.$axios.$get(url);
                    if (response && response.length > 0) {
                        const recs = response.map((item) => {
                            return {
                                id: item.id,
                                title: item.title,
                                similarity: item.similarity || 0,
                                average_rating: item.avgRating,
                                count: parseInt(item.ratingsCount, 10),
                                penalized: parseInt(item.penalized, 10)
                            };
                        });

                        this.downloadCSV(recs, `recommendations_movie_${this.movie.id}.csv`);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
    };
</script>

<style lang="sass">
    h2
        margin: 20px 0
    .btn-rec
        margin-top: 20px
</style>
