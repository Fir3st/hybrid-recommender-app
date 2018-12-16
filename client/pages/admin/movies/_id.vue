<template>
    <div class="admin-page">
        <app-breadcrumb :items="breadcrumbs" />
        <b-row>
            <b-col>
                <h1>{{ pageTitle }}</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <movie-detail-tab :movie="movie" />
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import AdminPage from '~/components/admin/AdminPage';
    import MovieDetailTab from '~/components/admin/MovieDetailTab';

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
                ]
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
        }
    };
</script>
