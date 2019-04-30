<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h1>{{ pageTitle }}</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <search-input
                        :on-change="onChange"
                        :search-term="searchTerm"
                    />
                </b-col>
            </b-row>
            <custom-search
                :search-genres="searchGenres"
                :custom-searching="customSearching"
                :custom-search="customSearch"
                :custom-search-text="customSearchText"
            />
            <results
                v-if="showResults"
                :searching="searching"
                :movies="movies"
                :custom-searching="customSearching"
                :custom-search-text="customSearchText"
                :search-term="searchTerm"
                :count="count"
                :load-more="loadMore"
                :take="take"
                :skip="skip"
            />
        </b-col>
    </b-row>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { CancelToken } from 'axios';
    import Input from '~/components/default/search/Input';
    import CustomSearch from '~/components/default/search/CustomSearch';
    import Results from '~/components/default/search/Results';

    export default {
        components: {
            CustomSearch,
            Results,
            SearchInput: Input
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
                take: 10,
                skip: 0,
                movies: [],
                count: 0,
                types: ['movie', 'movies', 'series', 'serial'],
                searchTerm: '',
                searchGenres: [],
                searchTypes: [],
                source: CancelToken.source(),
                showResults: false,
                searching: false,
                customSearching: false
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
        async created() {
            this.$root.$on('refreshResults', async () => await this.refreshResults());
        },
        methods: {
            async onChange(event) {
                this.searchTerm = event.target.value;
                this.requestReset();
                this.stateReset();
                this.showResults = false;

                if (this.searchTerm.length >= this.minLength) {
                    this.showResults = true;
                    this.searchGenres = this.containedGenres(this.searchTerm) || [];
                    this.searchTypes = this.containedTypes(this.searchTerm) || [];

                    await this.searchByQuery(this.searchTerm, this.take, this.skip);
                }
            },
            async customSearch() {
                const genres = this.genres.filter(item => this.searchGenres.includes(item.name.toLowerCase()));
                const type = (this.searchTypes.length === 1) ? this.type: 'all';
                this.requestReset();
                this.stateReset();
                this.customSearching = true;

                await this.searchByCustomParams(genres.map(item => item.id), type, this.take, this.skip);
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
            requestReset() {
                this.source.cancel('Request cancelled.');
                this.searching = true;
                this.source = CancelToken.source();
            },
            stateReset() {
                this.customSearching = false;
                this.movies = [];
                this.count = 0;
                this.take = 10;
                this.skip = 0;
            },
            async searchByQuery(searchQuery, take, skip) {
                try {
                    const url = `${this.url}?query=${searchQuery}&take=${take}&skip=${skip}`;
                    const response = await this.$axios.$get(url, { cancelToken: this.source.token });
                    const { movies, count } = response;
                    this.count = count;
                    if (movies && movies.length > 0) {
                        this.movies.push(...movies);
                    }
                } catch (error) {
                    console.log(error.message);
                }

                this.searching = false;
            },
            async searchByCustomParams(genres, type = 'all', take, skip) {
                let url = `${this.url}?genres=${genres.join(',')}&take=${take}&skip=${skip}`;

                if (type !== 'all') {
                    url = `${url}&type=${type}`;
                }

                try {
                    const response = await this.$axios.$get(url, { cancelToken: this.source.token });
                    const { movies, count } = response;
                    this.count = count;
                    if (movies && movies.length > 0) {
                        this.movies.push(...movies);
                    }
                } catch (error) {
                    console.log(error.message);
                }

                this.searching = false;
            },
            async loadMore() {
                if (this.count > this.movies.length) {
                    this.requestReset();
                    this.skip += this.take;
                    if (this.customSearching) {
                        const genres = this.genres.filter(item => this.searchGenres.includes(item.name.toLowerCase()));
                        const type = (this.searchTypes.length === 1) ? this.type: 'all';

                        await this.searchByCustomParams(genres.map(item => item.id), type, this.take, this.skip);
                    } else {
                        await this.searchByQuery(this.searchTerm, this.take, this.skip);
                    }
                }
            },
            async refreshResults() {
                this.requestReset();
                const skip = 0;
                const take = this.movies.length;
                this.movies = [];
                this.count = 0;

                if (this.customSearching) {
                    const genres = this.genres.filter(item => this.searchGenres.includes(item.name.toLowerCase()));
                    const type = (this.searchTypes.length === 1) ? this.type: 'all';

                    await this.searchByCustomParams(genres.map(item => item.id), type, take, skip);
                } else {
                    await this.searchByQuery(this.searchTerm, take, skip);
                }
            }
        }
    };
</script>

<style lang="sass" scoped>
    h1
        margin-bottom: 40px !important
    h2
        margin: 20px 0
</style>
