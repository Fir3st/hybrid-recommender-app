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
            await store.dispatch('movies/loadMovies', { genre: null, type: 'movie', orderBy: 'year', order: 'DESC' });
        }
    };
</script>
