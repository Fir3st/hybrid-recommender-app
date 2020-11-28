<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h1>{{ pageTitle }}</h1>
                </b-col>
            </b-row>
            <b-row v-if="!hasAllData">
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
                    <p><strong>Item for content-based recs:</strong> {{ settings.selectedItem ? settings.selectedItem.title : 'Nothing selected' }}</p>
                    <SearchInput
                        v-if="!settings.movieId"
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
    import * as _ from 'lodash';
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
        async asyncData ({ app }) {
            try {
                const user = await app.$axios.$get(`/users/${app.$auth.user.id}`);

                if (user) {
                    const settings = { take: 25 };
                    const movies = user.ratings.map((item) => {
                        return {
                            ...item.movie,
                            rating: item.rating
                        };
                    });
                    const favouriteGenres = user.favouriteGenres.filter(item => item.type === 1).map(item => item.genreId);
                    const notFavouriteGenres = user.favouriteGenres.filter(item => item.type === -1).map(item => item.genreId);

                    const highestRatedItems = movies.filter(item => item.rating === Math.max(...movies.map(movie => movie.rating)));
                    if (highestRatedItems.length === 1) {
                        settings.selectedItem = highestRatedItems[0];
                        settings.movieId = highestRatedItems[0].id;
                    } else {
                        const index = _.random(0, highestRatedItems.length - 1);
                        settings.selectedItem = highestRatedItems[index];
                        settings.movieId = highestRatedItems[index].id;
                    }

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
        head() {
            return {
                title: this.pageTitle
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
            },
            hasAllData() {
                return this.movies && this.movies.length >= this.numOfItems;
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
