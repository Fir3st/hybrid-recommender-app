<script>
    import MoviesPage from '~/components/default/MoviesPage';

    export default {
        extends: MoviesPage,
        data() {
            return {
                pageTitle: 'Main page'
            };
        },
        async fetch ({ store, params }) {
            await store.dispatch('movies/loadMovies');
        }
    };
</script>
