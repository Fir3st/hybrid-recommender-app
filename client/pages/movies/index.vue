<script>
    import MoviesPage from '~/components/default/MoviesPage';

    export default {
        extends: MoviesPage,
        data() {
            return {
                pageTitle: 'Movies'
            };
        },
        async fetch ({ store }) {
            await store.dispatch('movies/setGenre', null);
            await store.dispatch('movies/setType', 'movie');
            await store.dispatch('movies/setOrderBy', 'year');
            await store.dispatch('movies/setOrder', 'DESC');
            await store.dispatch('movies/setMovies');
            await store.dispatch('movies/setTopMovies');
            await store.dispatch('movies/setCount');
        }
    };
</script>
