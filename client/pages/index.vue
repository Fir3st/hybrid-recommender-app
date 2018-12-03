<template>
    <div>
        <b-row>
            <b-col>
                <h1>Movies</h1>
            </b-col>
        </b-row>
        <movie-list :movies="movies" />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MovieList from '../components/default/MovieList';

    export default {
        components: {
            MovieList
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        auth: false,
        data() {
            return {
                pageTitle: 'Main page'
            };
        },
        computed: {
            ...mapGetters({
                movies: 'movies/movies'
            })
        },
        async fetch ({ app, store }) {
            try {
                const movies = await app.$axios.$get(`/movies`);

                if (movies && movies.length > 0) {
                     store.commit('movies/setMovies', movies);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
</script>
