<script>
    import MoviesPage from '~/components/default/MoviesPage';

    export default {
        extends: MoviesPage,
        data() {
            return {
                pageTitle: 'Movies',
                contentType: 'movies'
            };
        },
        async fetch ({ store, query }) {
            await store.dispatch('movies/setPagination', query.page ? parseInt(query.page) : 1);
            await store.dispatch('movies/loadMovies', { genre: null, type: 'movie', orderBy: 'year', order: 'DESC' });
        }
    };
</script>
