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
        methods: {
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
