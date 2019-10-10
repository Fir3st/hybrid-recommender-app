<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Add new item</h2>
                </b-col>
            </b-row>
            <b-row v-if="movies.length >= maxItems">
                <b-col>
                    <p>You already have enough selected items.</p>
                </b-col>
            </b-row>
            <b-row
                v-else
                class="autocomplete-form"
            >
                <b-col>
                    <SearchInput
                        :search-term="searchTerm"
                        :on-change="search"
                        :suggestions="suggestions"
                        :on-select="selectItem"
                    />
                </b-col>
            </b-row>
            <MovieDetail
                v-if="selectedItem"
                :movie="selectedItem"
                :add-item-handler="addItem"
            />
        </b-col>
    </b-row>
</template>

<script>
    import { CancelToken } from 'axios';
    import SearchInput from '~/components/default/questionnaire/Input';
    import MovieDetail from "./MovieDetail";

    export default {
        components: {
            SearchInput,
            MovieDetail
        },
        props: {
            movies: {
                type: Array,
                required: true
            },
            addItemHandler: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                source: CancelToken.source(),
                maxItems: 20,
                minLength: 3,
                selectedItem: null,
                searchTerm: '',
                suggestions: []
            };
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
                    this.selectedItem = this.suggestions[movieIndex];
                }
                this.stateReset();
            },
            addItem() {
                if (this.selectedItem) {
                    this.addItemHandler({
                        ...this.selectedItem,
                        rating: 2.5
                    });
                }
                this.selectedItem = null;
            }
        }
    };
</script>

<style lang="sass" scoped>
    h2
        margin: 0 0 40px 0
    p
        margin: 0 0 40px 0
    .autocomplete-form
        margin-bottom: 40px;
</style>
