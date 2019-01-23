<script>
    import MoviesPage from '~/components/default/MoviesPage';

    export default {
        extends: MoviesPage,
        data() {
            return {
                pageTitle: 'Series'
            };
        },
        asyncData({ params }) {
            return {
                pageTitle: `Series - ${params.slug}`
            };
        },
        async fetch ({ store, params }) {
            await store.dispatch('movies/setGenre', params.slug);
            await store.dispatch('movies/setType', 'series');
            await store.dispatch('movies/setOrderBy', 'year');
            await store.dispatch('movies/setOrder', 'DESC');
            await store.dispatch('movies/setMovies');
            await store.dispatch('movies/setCount');
        }
    };
</script>
