<template>
    <div>
        <b-row>
            <b-col>
                <h1>{{ movieTitle }}</h1>
                <p>{{ movie.plot || '' }}</p>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <h2>You may also like</h2>
                <movie-list :movies="similarMovies" />
            </b-col>
        </b-row>
        <b-row v-if="isLogged && recommendedMovies.length > 0">
            <b-col>
                <h2>Recommended for you</h2>
                <movie-list :movies="recommendedMovies" />
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MovieList from '../../components/default/MovieList';

    export default {
        components: {
            MovieList
        },
        head() {
            return {
                title: this.movieTitle
            };
        },
        auth: false,
        data() {
            return {
                similarMovies: [],
                recommendedMovies: []
            };
        },
        computed: {
            ...mapGetters({
                movie: 'movies/activeMovie'
            }),
            isLogged() {
                return !!this.$auth.user;
            },
            movieTitle() {
                return (this.movie && this.movie.title) ? this.movie.title : 'Detail';
            }
        },
        async mounted() {
            await this.getSimilarMovies();
            if (this.isLogged) {
                await this.getUserRecommendedMovies();
            }
        },
        async fetch ({ app, store, params }) {
            try {
                const movie = await app.$axios.$get(`/movies/${params.id}`);

                if (movie) {
                    store.commit('movies/setActiveMovie', movie);
                }
            } catch (error) {
                console.log(error);
            }
        },
        methods: {
            async getSimilarMovies() {
                const id = this.$route.params.id;
                try {
                    const recommendations = await this.$axios.$get(`/movies/${id}/recommendations`);

                    if (recommendations && recommendations.length > 0) {
                        this.similarMovies = recommendations;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            async getUserRecommendedMovies() {
                const id = this.$auth.user.id;
                try {
                    const recommendations = await this.$axios.$get(`/users/${id}/recommendations`);

                    if (recommendations && recommendations.length > 0) {
                        this.recommendedMovies = recommendations;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };
</script>

<style lang="sass" scoped>
    h2
        padding: 20px 0
</style>
