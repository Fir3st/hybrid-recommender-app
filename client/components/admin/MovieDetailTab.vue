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
            <movie-analysis />
        </b-tab>
    </b-tabs>
</template>

<script>
    import MovieDetail from '~/components/admin/MovieDetail';
    import MovieRatings from '~/components/admin/MovieRatings';
    import MovieAnalysis from '~/components/admin/MovieAnalysis';

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
            }
        }
    };
</script>

<style lang="sass">
    .tab-content
        padding-top: 30px
</style>
