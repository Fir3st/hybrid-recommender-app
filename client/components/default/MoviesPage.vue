<template>
    <div>
        <b-row v-if="isMainCategory && skip === 0">
            <b-col>
                <b-row>
                    <b-col>
                        <h2>Top rated {{ contentType }}</h2>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <movie-list :movies="topMovies" />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h2>Newest {{ contentType }}</h2>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-else-if="!isMainCategory && skip === 0">
            <b-col>
                <h2>{{ pageTitle }}</h2>
                <hr />
            </b-col>
        </b-row>
        <movie-list :movies="movies" />
        <paginator />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MovieList from '~/components/default/MovieList';
    import Paginator from '~/components/default/Paginator';

    export default {
        components: {
            MovieList,
            Paginator
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        auth: false,
        data() {
            return {
                contentType: ''
            };
        },
        computed: {
            ...mapGetters({
                movies: 'movies/movies',
                topMovies: 'movies/topMovies',
                moviesCount: 'movies/count',
                take: 'movies/take',
                skip: 'movies/skip'
            }),
            isMainCategory() {
                const { path } = this.$route;
                return path === '/' || path === '/series' || path === '/movies';
            }
        }
    };
</script>

<style lang="sass" scoped>
    h1
        margin-bottom: 40px !important
    h2
        margin-bottom: 40px !important
        margin-top: 0
</style>
