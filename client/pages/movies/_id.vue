<template>
    <div>
        <b-row>
            <b-col>
                <h1>{{ movieTitle }}</h1>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        head() {
            return {
                title: this.movieTitle
            };
        },
        auth: false,
        computed: {
            ...mapGetters({
                movie: 'movies/activeMovie'
            }),
            movieTitle() {
                return (this.movie && this.movie.title) ? this.movie.title : 'Detail';
            }
        },
        async fetch ({ app, store, params }) {
            try {
                const movie = await app.$axios.$get(`/movies/${params.id}`);

                if (movie) {
                    store.commit('movies/setActiveMovie', movie);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
</script>
