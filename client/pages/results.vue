<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h1>{{ pageTitle }}</h1>
                </b-col>
            </b-row>
            <b-row v-if="movies.length < numOfItems || favouriteGenres.length < numOfGenres || notFavouriteGenres.length < numOfGenres">
                <b-col>
                    <p>
                        You don't meet requirements for showing results. Please go back to
                        <nuxt-link to="/questionnaire">
                            questionnaire
                        </nuxt-link>
                        and fill the form.
                    </p>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col>
                    <p><strong>Selected item:</strong> {{ settings.general.selectedItem ? settings.general.selectedItem.title : 'Nothing selected' }}</p>
                    <SearchInput
                        :search-term="searchTerm"
                        :on-change="search"
                        :suggestions="suggestions"
                        :on-select="selectItem"
                    />
                    <ResultsTab
                        :settings="settings"
                        :movies="movies"
                        :favourite-genres="favouriteGenres"
                        :not-favourite-genres="notFavouriteGenres"
                    />
                </b-col>
            </b-row>
            <el-backtop />
        </b-col>
    </b-row>
</template>

<script>
    import { CancelToken } from 'axios';
    import { mapGetters } from 'vuex';
    import { numOfGenres, numOfItems } from '~/utils/constants';
    import ResultsTab from '~/components/default/results/ResultsTab';
    import SearchInput from '~/components/default/questionnaire/Input';

    export default {
        components: {
            ResultsTab,
            SearchInput
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        data() {
            return {
                pageTitle: 'Results page',
                searchTerm: '',
                suggestions: [],
                source: CancelToken.source(),
                minLength: 3,
                numOfGenres: numOfGenres,
                numOfItems: numOfItems
            };
        },
        computed: {
            ...mapGetters({
                allGenres: 'genres/genres'
            }),
            genres() {
                const genres = this.allGenres.filter(item => item.name !== 'N/A');
                const options = genres.map((item) => {
                    return { value: item.id, text: item.name };
                });

                return [
                    { value: null, text: 'Please select a genre(s)' },
                    ...options
                ];
            }
        },
        async asyncData ({ app }) {
            try {
                const user = await app.$axios.$get(`/users/${app.$auth.user.id}`);
                const settings = await app.$axios.$get('/results/settings');

                if (user && settings) {
                    const movies = user.ratings.map((item) => {
                        return {
                            ...item.movie,
                            rating: item.rating
                        };
                    });
                    const favouriteGenres = user.favouriteGenres.filter(item => item.type === 1).map(item => item.genreId);
                    const notFavouriteGenres = user.favouriteGenres.filter(item => item.type === -1).map(item => item.genreId);
                    return {
                        movies,
                        user,
                        favouriteGenres,
                        notFavouriteGenres,
                        settings
                    };
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        methods: {
            requestReset() {
                this.source.cancel('Request cancelled.');
                this.source = CancelToken.source();
            },
            stateReset() {
                this.suggestions = [];
                this.requestReset();
            },
            async search(event) {
                this.searchTerm = event.target.value;
                this.stateReset();
                if (this.searchTerm && this.searchTerm.length > this.minLength) {
                    try {
                        const url = `/movies/search?query=${this.searchTerm}&take=100`;
                        const response = await this.$axios.$get(url, { cancelToken: this.source.token });
                        const { movies } = response;
                        if (movies && movies.length > 0) {
                            this.suggestions = movies;
                        }
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            },
            selectItem(id) {
                const movieIndex = this.suggestions.findIndex(item => item.id === id);
                if (movieIndex > -1) {
                    this.settings.general.selectedItem = this.suggestions[movieIndex];
                    this.settings.general.movieId = this.suggestions[movieIndex].id;
                }
                this.stateReset();
                this.searchTerm = '';
            }
        }
    };
</script>

<style lang="sass" scoped>
    h1
        margin-bottom: 40px !important
    h2
        margin: 20px 0
    .btns
        margin-top: 40px
</style>
