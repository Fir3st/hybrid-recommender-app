<template>
    <b-tabs>
        <b-tab
            title="Movie information"
            active>
            <movie-detail :movie="movie" />
        </b-tab>
    </b-tabs>
</template>

<script>
    import MovieDetail from '~/components/admin/MovieDetail';

    export default {
        components: {
            MovieDetail
        },
        props: {
            movie: {
                type: Object,
                required: true
            }
        }
    };
</script>
