<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h1>{{ pageTitle }}</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <AddItemForm
                        :movies="movies"
                        :add-item-handler="addItem"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <RatedMoviesGrid
                        :movies="movies"
                        :delete-handler="deleteMovieHandler"
                        :change-rating-handler="changeRatingHandler"
                        :penalize-handler="penalizeHandler"
                    />
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import { mapGetters } from 'vuex';
    import RatedMoviesGrid from '~/components/default/questionnaire/RatedMoviesGrid';
    import AddItemForm from '~/components/default/questionnaire/AddItemForm';

    export default {
        components: {
            RatedMoviesGrid,
            AddItemForm
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        data() {
            return {
                pageTitle: 'Questionnaire'
            };
        },
        computed: {
            ...mapGetters({
                genres: 'genres/genres'
            })
        },
        async asyncData ({ app }) {
            try {
                const user = await app.$axios.$get(`/users/${app.$auth.user.id}`);

                if (user) {
                    const movies = user.ratings.map((item) => {
                        return {
                            ...item.movie,
                            rating: item.rating
                        };
                    });
                    return {
                        movies,
                        user
                    };
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        methods: {
            deleteMovieHandler(id) {
                const movieIndex = this.movies.findIndex(item => item.id === id);
                if (movieIndex > -1) {
                    this.movies.splice(movieIndex, 1);
                }
            },
            changeRatingHandler(id, value) {
                const movieIndex = this.movies.findIndex(item => item.id === id);
                if (movieIndex > -1) {
                    this.movies[movieIndex].rating = value;
                }
            },
            penalizeHandler(id) {
                const movieIndex = this.movies.findIndex(item => item.id === id);
                if (movieIndex > -1) {
                    this.movies[movieIndex].rating = 0;
                }
            },
            addItem(item) {
                const movieIndex = this.movies.findIndex(movie => movie.id === item.id);
                if (movieIndex === -1) {
                    this.movies = [
                        item,
                        ...this.movies
                    ];
                }
            }
        },
    };
</script>

<style lang="sass" scoped>
    h1
        margin-bottom: 40px !important
</style>
