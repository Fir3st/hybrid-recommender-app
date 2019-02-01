<script>
    import MoviesPage from '~/components/default/MoviesPage';

    export default {
        extends: MoviesPage,
        data() {
            return {
                pageTitle: 'Series'
            };
        },
        async fetch ({ store }) {
            await store.dispatch('movies/loadMovies', { genre: null, type: 'series', orderBy: 'year', order: 'DESC' });
        }
    };
</script>
