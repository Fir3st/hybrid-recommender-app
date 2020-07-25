<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Number of rated movies</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <p>User rated {{ ratings.length }} movies</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h2>User's preferences</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <user-genres-chart
                        :preferences="preferences"
                    />
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import { mapGetters } from 'vuex';
    import UserGenresChart from '~/components/admin/users/UserGenresChart';

    export default {
        components: {
            UserGenresChart,
        },
        props: {
            ratings: {
                type: Array,
                required: true
            },
            recommendations: {
                type: Array,
                required: true
            },
            preferences: {
                type: Array,
                required: true
            },
            user: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                genreId: null,
                genreRecommendations: null
            };
        },
        computed: {
            ...mapGetters({
                allGenres: 'genres/genres'
            }),
            genres() {
                return this.allGenres.filter(item => item.name !== 'N/A');

            },
            selectedGenre() {
                return this.genres.find(item => item.id === this.genreId);
            },
            options() {
                const options = this.genres.map((item) => {
                    return { value: item.id, text: item.name };
                });

                return [
                    { value: null, text: 'Selected genre' },
                    ...options
                ];
            }
        },
        methods: {
            async getRecommendationsForGenre() {
                this.genreRecommendations = null;
                try {
                    const url = `/users/${this.user.id}/recommendations?genres=${this.genreId}`;
                    const recommendations = await this.$axios.$get(url);

                    if (recommendations && recommendations.length > 0) {
                        this.genreRecommendations = recommendations;
                    }
                } catch (error) {
                    console.log(error.message);
                }
            },
            async downloadRecommendationsCSV() {
                try {
                    const response = await this.$axios.$get(`/users/${this.user.id}/recommendations?take=100`);
                    if (response && response.length > 0) {
                        const recs = response.map((item) => {
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

                        this.downloadCSV(recs, `recommendations_user_${this.user.id}.csv`);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            },
            async downloadGenreRecommendationsCSV() {
                try {
                    const url = `/users/${this.user.id}/recommendations?genres=${this.genreId}&take=100`;
                    const response = await this.$axios.$get(url);
                    if (response && response.length > 0) {
                        const recs = response.map((item) => {
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

                        this.downloadCSV(recs, `recommendations_user_${this.user.id}_genre_${this.genreId}.csv`);
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
