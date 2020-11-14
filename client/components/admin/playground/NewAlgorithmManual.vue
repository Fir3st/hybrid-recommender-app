<template lang="pug">
    b-row
        b-col
            b-row
                b-col
                    h2 New Algorithm - manual entries
            b-row
                b-col
                    b-form
                        label(for="toTake") Number of recommendations
                        b-form-input(v-model="toTake", type="number", id="toTake", name="toTake", min="1")
                        b-form-group(id="userId", label="User", label-for="userId")
                            b-form-select(id="userId", v-model="userId", :options="options", required, placeholder="Select user to analyze")
                        label(for="compare") Compare to these users (IDs, separed with semicolon)
                        b-form-input(v-model="compareTo", type="text", id="compare", class="mb-2")
                        b-button(type="button", :disabled="!userId", @click="getRecommendations", variant="secondary") Get recommended movies
            Loading(v-if="loading")
            b-row(v-if="!loading && movies.length", class="mt-2 mb-2")
                b-col
                    h3 Recommended movies
                    b-table(striped, hover, :items="movies", :fields="moviesFields")
                        template(v-slot:cell(#)="data") {{ data.index + 1 }}

</template>

<script>
    import moment from 'moment';
    import * as _ from 'lodash';
    import Loading from '~/components/default/search/Loading';

    export default {
        components: {
            Loading
        },
        data() {
            return {
                loading: false,
                userId: null,
                options: [
                    { value: null, text: 'User to analyze' },
                ],
                users: [],
                moviesFields: [
                    '#',
                    { key: 'id', label: 'ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'predictedRating', label: 'Rating' },
                    { key: 'similarity', label: 'Similarity' }
                ],
                genres: [],
                movies: [],
                toTake: 25,
                compareTo: ''
            };
        },
        computed: {
            mostRatedGenres() {
                return this.getMostRatedGenres();
            },
            mostValuedGenres() {
                return this.getMostValuedGenres();
            },
            leastRatedGenres() {
                return this.getLeastRatedGenres();
            },
            leastValuedGenres() {
                return this.getLeastValuedGenres();
            },
            mostRatedGenresAll() {
                return this.getMostRatedGenres(12);
            },
            mostValuedGenresAll() {
                return this.getMostValuedGenres(12);
            },
            leastRatedGenresAll() {
                return this.getLeastRatedGenres(12);
            },
            leastValuedGenresAll() {
                return this.getLeastValuedGenres(12);
            }
        },
        async mounted() {
            await this.getUsers();
        },
        methods: {
            moment: function (date = null) {
                return moment(date);
            },
            getMostRatedGenres(num = 3) {
                const ratedGenres = this.genres.filter((genre) => genre.count);

                if (ratedGenres && ratedGenres.length > 0) {
                    return _.orderBy(this.genres, ['count'], ['desc']).slice(0, num);
                }

                return [];
            },
            getMostValuedGenres(num = 3) {
                const ratedGenres = this.genres.filter((genre) => genre.count);

                if (ratedGenres && ratedGenres.length > 0) {
                    return _.orderBy(this.genres, ['value'], ['desc']).slice(0, num);
                }

                return [];
            },
            getLeastRatedGenres(num = 3) {
                const notRatedGenres = this.genres.filter((genre) => genre.count === 0);

                if (notRatedGenres && notRatedGenres.length < num) {
                    let genres = this.genres.filter((genre) => genre.count);
                    genres = [
                        ..._.orderBy(genres, ['count'], ['desc']).slice(Math.max(genres.length - (num - notRatedGenres.length), 0)),
                        ...notRatedGenres,
                    ];

                    return genres;
                }

                return notRatedGenres;
            },
            getLeastValuedGenres(num = 3) {
                const notRatedGenres = this.genres.filter((genre) => genre.count === 0);

                if (notRatedGenres && notRatedGenres.length < num) {
                    let genres = this.genres.filter((genre) => genre.count);
                    genres = [
                        ..._.orderBy(genres, ['value'], ['desc']).slice(Math.max(genres.length - (num - notRatedGenres.length), 0)),
                        ...notRatedGenres,
                    ];

                    return genres;
                }

                return notRatedGenres;
            },
            async getUsers() {
                let users = [];

                try {
                    const url = `/users?take=-1`;

                    const response = await this.$axios.$get(url);
                    if (response && response.length > 0) {
                        users = response.map((user) => ({ value: user.id, text: `${user.name} ${user.surname} (ID: ${user.id})` }));
                    }
                } catch (error) {
                    console.log(error.message);
                }

                this.options = [{ value: null, text: 'User to analyze' }, ...users];
            },
            async analyzeUser() {
                this.loading = true;
                this.movies = [];

                try {
                    const url = `/users/${this.userId}/analyze`;

                    const response = await this.$axios.$get(url);

                    if (response.genres && response.genres.length) {
                        this.genres = response.genres;
                    }
                    if (response.ratings && response.ratings.length) {
                        this.favouriteItems = response.ratings;
                    }
                } catch (error) {
                    console.log(error.message);
                } finally {
                    this.loading = false;
                }
            },
            async getRecommendations() {
                this.loading = true;
                this.favouriteItems = [];
                this.genres = [];

                try {
                    const url = `/playground/users/${this.userId}?take=${this.toTake}&compareTo=${this.compareTo}`;

                    const response = await this.$axios.$get(url);

                    if (response && response.length) {
                        this.movies = response;
                    }
                } catch (error) {
                    console.log(error.message);
                } finally {
                    this.loading = false;
                }
            },
        }
    };
</script>

<style lang="sass">
    h2
        margin: 20px 0
</style>
