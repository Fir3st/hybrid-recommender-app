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
        async fetch ({ store, params, query }) {
            await store.dispatch('movies/setPagination', query.page ? parseInt(query.page) : 1);
            await store.dispatch('movies/loadMovies', { genre: params.slug, type: 'series', orderBy: 'year', order: 'DESC' });
        }
    };
</script>
