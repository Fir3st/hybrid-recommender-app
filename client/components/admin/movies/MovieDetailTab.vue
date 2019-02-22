<template>
    <b-tabs>
        <b-tab
            title="Movie information"
            active>
            <movie-detail :movie="movie" />
        </b-tab>
        <b-tab
            title="Movie user's ratings">
            <movie-ratings :ratings="ratings" />
        </b-tab>
        <b-tab
            title="Analysis">
            <movie-analysis
                :topics="topics"
                :recommendations="recommendations"
                :ratings="ratings"
                :avg-rating="avgRating" />
        </b-tab>
    </b-tabs>
</template>

<script>
    import MovieDetail from '~/components/admin/movies/MovieDetail';
    import MovieRatings from '~/components/admin/movies/MovieRatings';
    import MovieAnalysis from '~/components/admin/movies/MovieAnalysis';

    export default {
        components: {
            MovieDetail,
            MovieRatings,
            MovieAnalysis
        },
        props: {
            movie: {
                type: Object,
                required: true
            },
            ratings: {
                type: Array,
                required: true
            },
            topics: {
                type: Array,
                required: true
            },
            recommendations: {
                type: Array,
                required: true
            },
            avgRating: {
                type: Number,
                required: true
            }
        }
    };
</script>

<style lang="sass">
    .tab-content
        padding-top: 30px
</style>
