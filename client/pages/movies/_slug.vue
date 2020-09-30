<script>
    import MoviesPage from '~/components/default/MoviesPage';

    export default {
        extends: MoviesPage,
        asyncData({ params }) {
            return {
                genreName: params.slug
            };
        },
        data() {
            return {
                pageTitle: 'Movies'
            };
        },
        async fetch ({ store, params, query }) {
            await store.dispatch('movies/setPagination', query.page ? parseInt(query.page) : 1);
            await store.dispatch('movies/loadMovies', { genre: params.slug, type: 'movie', orderBy: 'year', order: 'DESC' });
        }
    };
</script>
