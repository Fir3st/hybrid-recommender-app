<template>
    <div>
        <b-row>
            <b-col>
                <h1>{{ pageTitle }}</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <input
                    v-model="searchTerm"
                    class="form-control search"
                    type="text"
                    placeholder="Type to search"
                    @input="onChange"
                />
            </b-col>
        </b-row>
        <b-row v-if="searchGenres.length > 0">
            <b-col>
                <p class="custom-search">
                    Do you want to search
                    <a
                        href="#"
                        @click="customSearch"
                    >{{ customSearchText }}</a>?
                </p>
            </b-col>
        </b-row>
        <b-row v-if="search">
            <b-col v-if="movies.length > 0">
                <b-row>
                    <b-col>
                        <h2>{{ movies.length }} results for '{{ searchTerm }}':</h2>
                    </b-col>
                </b-row>
                <movie-list :movies="movies" />
            </b-col>
            <b-col v-else>
                <b-row>
                    <b-col>
                        <h2>No results found for '{{ searchTerm }}'.</h2>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { CancelToken } from 'axios';
    import MovieList from '~/components/default/MovieList';

    export default {
        components: {
            MovieList
        },
        auth: false,
        head() {
            return {
                title: this.pageTitle
            };
        },
        data() {
            return {
                pageTitle: 'Search',
                minLength: 3,
                movies: [],
                types: ['movie', 'movies', 'series', 'serial'],
                searchTerm: '',
                searchGenres: [],
                searchTypes: [],
                source: CancelToken.source(),
                search: false
            };
        },
        computed: {
            ...mapGetters({
                genres: 'genres/genres'
            }),
            customSearchText() {
                let text = this.searchGenres.join('/');
                if (this.searchTypes.length === 1) {
                    text = `${text} ${this.searchTypes[0]}`;
                }

                return text;
            },
            type() {
                const type = this.searchTypes[0];
                return (type === 'movies' || type === 'movie') ? 'movie' : 'series';
            },
            isLogged() {
                return !!this.$auth.user;
            },
            url() {
                return this.isLogged ? '/movies/secured-search' : '/movies/search';
            }
        },
        methods: {
            async onChange() {
                this.reset();

                if (this.searchTerm.length >= this.minLength) {
                    this.searchGenres = this.containedGenres(this.searchTerm) || [];
                    this.searchTypes = this.containedTypes(this.searchTerm) || [];

                    await this.searchByQuery(this.searchTerm);
                }
            },
            async customSearch() {
                const genres = this.genres.filter(item => this.searchGenres.includes(item.name.toLowerCase()));
                const type = (this.searchTypes.length === 1) ? this.type: 'all';
                this.reset();

                await this.searchByCustomParams(genres.map(item => item.id), type);
            },
            containedGenres(searchQuery) {
                const genres = this.genres
                    .map(genre => genre.name.toLowerCase())
                    .join('|');

                return searchQuery.match(new RegExp(genres, 'g'));
            },
            containedTypes(searchQuery) {
                const types = this.types
                    .map(type => type.toLowerCase())
                    .join('|');

                return searchQuery.match(new RegExp(types, 'g'));
            },
            reset() {
                this.source.cancel('Request cancelled.');
                this.search = false;
                this.source = CancelToken.source();
                this.movies = [];
                this.searchGenres = [];
                this.searchTypes = [];
            },
            async searchByQuery(searchQuery) {
                try {
                    const results = await this.$axios.$get(`${this.url}?query=${searchQuery}`, { cancelToken: this.source.token });
                    if (results && results.length > 0) {
                        this.movies = results;
                    }
                } catch (error) {
                    console.log(error.message);
                }

                this.search = true;
            },
            async searchByCustomParams(genres, type = 'all') {
                let url = `${this.url}?genres=${genres.join(',')}`;

                if (type !== 'all') {
                    url = `${url}&type=${type}`;
                }
                
                try {
                    const results = await this.$axios.$get(url, { cancelToken: this.source.token });
                    if (results && results.length > 0) {
                        this.movies = results;
                    }
                } catch (error) {
                    console.log(error.message);
                }

                this.search = true;
                console.log('Searching for genres', genres);
                console.log('Searching for type', type);
            }
        }
    };
</script>

<style lang="sass" scoped>
    h1
        margin-bottom: 40px !important
    h2
        margin: 20px 0
    .search
        background: transparent
        border: 0
        font-size: 24px
        padding: 20px 10px
        border-bottom: 1px solid #17a2b8
        color: #fff
    .search:focus
        outline: none
        -webkit-box-shadow: none !important
        -moz-box-shadow: none !important
        box-shadow: none !important
    .custom-search
        margin-top: 20px
        color: #ccc
</style>
