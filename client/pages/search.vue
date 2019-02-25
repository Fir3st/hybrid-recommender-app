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
        <b-row v-if="search">
            <b-col v-if="movies.length > 1">
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
    import MovieList from '~/components/default/MovieList';

    export default {
        components: {
            MovieList
        },
        auth: false,
        data() {
            return {
                pageTitle: 'Search',
                minLength: 3,
                movies: [],
                searchTerm: '',
                search: false
            };
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        methods: {
            async onChange() {
                this.search = false;
                if (this.searchTerm.length >= this.minLength) {
                    this.movies = [];

                    try {
                        const results = await this.$axios.$get(`/movies/search/${this.searchTerm}`);
                        if (results) {
                            this.movies = results;
                        }
                    } catch (error) {
                        console.log(error.message);
                    }

                    this.search = true;
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
</style>
