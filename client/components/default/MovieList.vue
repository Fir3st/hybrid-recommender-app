<template>
    <b-row>
        <movie-card
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            :additional-info="additionalInfo"
            :show-rating-buttons="showRatingButtons"
            :similarity="similarity"
            class="movie"
        />
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
            },
            additionalInfo: {
                type: Boolean,
                required: false,
                default: false
            },
            showRatingButtons: {
                type: Boolean,
                required: false,
                default: false
            },
            similarity: {
                type: Boolean,
                required: false,
                default: false
            }
        }
    };
</script>

<style lang="sass" scoped>
    .movie
        color: black
</style>
