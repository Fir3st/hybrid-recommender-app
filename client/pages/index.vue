<template>
    <div>
        <b-row>
            <b-col>
                <h1>Main page</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="6">ddd</b-col>
            <b-col sm="6">ddd</b-col>
        </b-row>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
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
        async fetch ({ app, store, params }) {
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
