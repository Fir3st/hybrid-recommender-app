<template>
    <div>
        <b-row v-if="movie">
            <b-col>
                <b-row>
                    <b-col
                        sm="5"
                        md="4"
                        lg="3"
                    >
                        <movie-poster :movie="movie" />
                    </b-col>
                    <b-col
                        sm="7"
                        md="8"
                        lg="9"
                    >
                        <b-row>
                            <b-col>
                                <h1>{{ movieTitle }}</h1>
                            </b-col>
                        </b-row>
                        <movie-stats :movie="movie" />
                        <movie-info :movie="movie" />
                    </b-col>
                </b-row>
                <movie-description :movie="movie" />
                <rating
                    :user-rating="userRating"
                    :rate-movie="rateMovie"
                />
                <b-row v-if="similarMovies.length > 0">
                    <b-col>
                        <h2>You may also like</h2>
                        <movie-list
                            :movies="similarMovies"
                            :additional-info="true"
                            :similarity="true"
                        />
                    </b-col>
                </b-row>
                <b-row v-if="isLogged && recommendedMovies.length > 0">
                    <b-col>
                        <h2>Recommended for you</h2>
                        <movie-list
                            :movies="recommendedMovies"
                            :additional-info="true"
                            :rating="true"
                        />
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
    import Rating from '~/components/default/Rating';
    import MovieStats from '~/components/default/MovieStats';
    import MovieInfo from '~/components/default/MovieInfo';
    import MoviePoster from '~/components/default/MoviePoster';
    import MovieDescription from '~/components/default/MovieDescription';

    export default {
        components: {
            MovieList,
            Rating,
            MovieStats,
            MovieDescription,
            MovieInfo,
            MoviePoster
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
            movieTitle() {
                return (this.movie && this.movie.title) ? this.movie.title : 'Detail';
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
        async mounted() {
            this.getSimilarMovies();
            if (this.isLogged) {
                this.getUserRecommendedMovies();
                this.getUserRating();
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
    h1
        margin-top: 0
    h2
        padding: 20px 0
</style>
