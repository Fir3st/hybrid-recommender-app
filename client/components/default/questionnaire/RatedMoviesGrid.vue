<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Selected movies</h2>
                </b-col>
            </b-row>
            <MovieGridItem
                v-for="movie in movies"
                :key="movie.id"
                :movie="movie"
                :rating="movie.rating"
                :delete-handler="deleteHandler"
                :change-rating-handler="changeRatingHandler"
                :penalize-handler="penalizeHandler"
            />
        </b-col>
    </b-row>
</template>

<script>
    import MovieGridItem from './MovieGridItem';

    export default {
        components: {
            MovieGridItem
        },
        props: {
            movies: {
                type: Array,
                required: true,
                default: () => {
                    return [];
                }
            },
            deleteHandler: {
                type: Function,
                required: true
            },
            changeRatingHandler: {
                type: Function,
                required: true
            },
            penalizeHandler: {
                type: Function,
                required: true
            }
        }
    };
</script>

<style lang="sass" scoped>
    h2
        margin: 0 0 40px 0
    .movie-row
        min-height: 50px
</style>
