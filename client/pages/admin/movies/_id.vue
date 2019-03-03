<template>
    <div class="admin-page">
        <app-breadcrumb :items="breadcrumbs" />
        <b-row v-if="movie">
            <b-col>
                <b-row>
                    <b-col>
                        <h1>{{ pageTitle }}</h1>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <movie-detail-tab
                            :movie="movie"
                            :ratings="ratings"
                            :recommendations="recommendations"
                            :avg-rating="avgRating"
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
    import AdminPage from '~/components/admin/AdminPage';
    import MovieDetailTab from '~/components/admin/movies/MovieDetailTab';

    export default {
        components: {
            MovieDetailTab
        },
        extends: AdminPage,
        data() {
            return {
                breadcrumbs: [
                    { index: 0, name: 'movies', path: '/admin/movies' },
                    { index: 1, name: 'movie detail' , path: null }
                ],
                ratings: [],
                recommendations: [],
                avgRating: 0
            };
        },
        computed: {
            pageTitle() {
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
        mounted() {
            if (this.movie) {
                const promises = [];
                promises.push(this.$axios.$get(`/movies/${this.movie.id}/ratings`));
                promises.push(this.$axios.$get(`/movies/${this.movie.id}/recommendations`));
                promises.push(this.$axios.$get(`/movies/${this.movie.id}/avg-rating`));

                return Promise.all(promises).then((data) => {
                    this.ratings = data[0];
                    this.recommendations = data[1];
                    this.avgRating = data[2].avgRating ? data[2].avgRating : 0;
                });
            }
        }
    };
</script>
