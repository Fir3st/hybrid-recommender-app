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
            await store.dispatch('movies/setGenre', params.slug);
            await store.dispatch('movies/setType', 'all');
            await store.dispatch('movies/setOrderBy', 'year');
            await store.dispatch('movies/setOrder', 'DESC');
            await store.dispatch('movies/setMovies');
            await store.dispatch('movies/setTopMovies');
            await store.dispatch('movies/setCount');
        }
    };
</script>
