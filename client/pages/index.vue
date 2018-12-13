<template>
    <div>
        <b-row>
            <b-col>
                <h1>Movies</h1>
            </b-col>
        </b-row>
        <movie-list :movies="movies" />
        <paginator />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MovieList from '../components/default/MovieList';
    import Paginator from '../components/default/Paginator';

    export default {
        components: {
            MovieList,
            Paginator
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
                movies: 'movies/movies',
                moviesCount: 'movies/count',
                take: 'movies/take',
                skip: 'movies/skip'
            })
        }
    };
</script>

<style lang="sass" scoped>
    h1
        margin-bottom: 40px !important
</style>
