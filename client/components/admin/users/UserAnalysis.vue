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
                    <user-preferences-chart
                        :preferences="preferences"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h2>Recommendations (overall)</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <recommended-movies-table
                        :recommendations="recommendations"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h2>Recommendations for specific genre</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-select
                        v-model="genreId"
                        :options="options"
                    ></b-form-select>
                    <b-button
                        class="btn-rec"
                        variant="outline-primary"
                        @click="getRecommendationsForGenre"
                    >
                        Get recommendations
                    </b-button>
                </b-col>
            </b-row>
            <b-row v-if="genreRecommendations">
                <b-col>
                    <b-row v-if="selectedGenre">
                        <b-col>
                            <h2>Recommendations for genre: {{ selectedGenre.name }}</h2>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <recommended-movies-table
                                :recommendations="genreRecommendations"
                                :additional-info="true"
                            />
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import { mapGetters } from 'vuex';
    import UserPreferencesChart from '~/components/admin/users/UserPreferencesChart';
    import RecommendedMoviesTable from '~/components/admin/users/RecommendedMoviesTable';

    export default {
        components: {
            UserPreferencesChart,
            RecommendedMoviesTable
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
                    const url = `/users/${this.user.id}/${this.genreId}/recommendations`;
                    const recommendations = await this.$axios.$get(url);

                    if (recommendations && recommendations.length > 0) {
                        this.genreRecommendations = recommendations;
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
