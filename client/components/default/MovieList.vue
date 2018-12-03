<template>
    <b-row>
        <movie-card
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            class="movie" />
    </b-row>
</template>

<script>
    import MovieCard from './MovieCard';

    export default {
        components: {
            MovieCard
        },
        props: {
            movies: {
                type: Array,
                required: true,
                default: null
            }
        }
    };
</script>

<style lang="sass" scoped>
    .movie
        color: black
</style>
