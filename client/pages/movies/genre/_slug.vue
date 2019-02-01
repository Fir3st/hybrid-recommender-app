<script>
    import MoviesPage from '~/components/default/MoviesPage';

    export default {
        extends: MoviesPage,
        data() {
            return {
                pageTitle: 'Movies'
            };
        },
        asyncData({ params }) {
            return {
                pageTitle: `Movies - ${params.slug}`
            };
        },
        async fetch ({ store, params }) {
            await store.dispatch('movies/loadMovies', { genre: params.slug, type: 'movie', orderBy: 'year', order: 'DESC' });
        }
    };
</script>
