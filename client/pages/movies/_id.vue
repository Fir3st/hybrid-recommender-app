<template>
    <div>
        <b-row v-if="movie">
            <b-col>
                <media-player />
                <b-row>
                    <b-col>
                        <h1>{{ movieTitle }}</h1>
                    </b-col>
                </b-row>
                <movie-info :movie="movie" />
                <movie-description :movie="movie" />
                <rating
                    :is-logged="isLogged"
                    :user-rating="userRating"
                    :rate-movie="rateMovie"/>
                <b-row v-if="similarMovies.length > 0">
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
            </b-col>
        </b-row>
        <b-row v-else>
            <b-col>
                <h1>Movie not found</h1>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import MovieList from '~/components/default/MovieList';
    import MediaPlayer from '~/components/default/MediaPlayer';
    import Rating from '~/components/default/Rating';
    import MovieInfo from '~/components/default/MovieInfo';
    import MovieDescription from '~/components/default/MovieDescription';

    export default {
        components: {
            MovieList,
            MediaPlayer,
            Rating,
            MovieInfo,
            MovieDescription
        },
        head() {
            return {
                title: this.movieTitle
            };
        },
        auth: false,
        data() {
            return {
                movie: null,
                userRating: 0,
                similarMovies: [],
                recommendedMovies: [],
            };
        },
        computed: {
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
                await this.getUserRating();
            }
        },
        async asyncData ({ app, params }) {
            try {
                const movie = await app.$axios.$get(`/movies/${params.id}`);

                if (movie) {
                    return {
                        movie
                    };
                }
            } catch (error) {
                console.log(error.message);
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
                    console.log(error.message);
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
                    console.log(error.message);
                }
            },
            async getUserRating() {
                try {
                    const movieId = this.$route.params.id;
                    const rating = await this.$axios.$get(`/movies/${movieId}/rating`);

                    if (rating) {
                        this.userRating = rating.value;
                    }
                } catch (error) {
                    console.log(error.message);
                }
            },
            async rateMovie(value) {
                this.userRating = value;
                try {
                    const movieId = this.$route.params.id;
                    await this.$axios.$post(`/movies/${movieId}/rating`, { rating: this.userRating });
                    this.$notify({
                        title: 'Success',
                        message: `You have successfully rated movie ${this.movie.title}.`,
                        type: 'success',
                        position: 'bottom-right'
                    });
                    await this.getUserRecommendedMovies();
                } catch (error) {
                    console.log(error.message);
                    this.$notify({
                        title: 'Error',
                        message: `Something went wrong with rating ${this.movie.title}. Please try it again.`,
                        type: 'error',
                        position: 'bottom-right'
                    });
                }
            }
        }
    };
</script>

<style lang="sass" scoped>
    h2
        padding: 20px 0
</style>
