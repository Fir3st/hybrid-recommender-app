<template lang="pug">
    b-row
        b-col
            b-row
                b-col
                    h2 New Algorithm
            b-row
                b-col
                    b-form(@submit.prevent="analyzeUser")
                        b-form-group(id="userId", label="User", label-for="userId")
                            b-form-select(id="userId", v-model="userId", :options="options", required, placeholder="Select user to analyze")
                        b-button(type="submit", variant="primary") Analyze user
            Loading(v-if="loading")
            b-row(v-if="!loading && favouriteItems.length", class="mt-2 mb-2")
                b-col
                    h3 Favourite movies and series
                    b-table(striped, hover, :items="favouriteItems", :fields="favouriteItemsFields")
                        template(v-slot:cell(#)="data") {{ data.index + 1 }}
                        template(v-slot:cell(usersRatings[0].createdAt)="data") {{ moment(data.item.usersRatings[0].createdAt).format('DD. MM. YYYY HH:mm:ss') }}
            b-row(v-if="!loading && topGenres.length", class="mt-2 mb-2")
                b-col
                    h3 Most important genres
                    b-table(striped, hover, :items="topGenres")
            b-row(v-if="!loading && unimportantGenres.length", class="mt-2 mb-2")
                b-col
                    h3 Least important genres
                    b-table(striped, hover, :items="unimportantGenres")
            b-row(v-if="!loading && topGenresAll.length", class="mt-2 mb-2")
                b-col
                    h3 Most important genres (12)
                    b-table(striped, hover, :items="topGenresAll")
            b-row(v-if="!loading && unimportantGenresAll.length", class="mt-2 mb-2")
                b-col
                    h3 Least important genres (12)
                    b-table(striped, hover, :items="unimportantGenresAll")

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
                favouriteItems: [],
                favouriteItemsFields: [
                    '#',
                    { key: 'id', label: 'ID' },
                    { key: 'imdbId', label: 'IMDB ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'usersRatings[0].rating', label: 'Rating value' },
                    { key: 'usersRatings[0].createdAt', label: 'Rated at' }
                ],
                genres: []
            };
        },
        computed: {
            topGenres() {
                return this.getTopGenres();
            },
            unimportantGenres() {
                return this.getUnimportantGenres();
            },
            topGenresAll() {
                return this.getTopGenres(12);
            },
            unimportantGenresAll() {
                return this.getUnimportantGenres(12);
            }
        },
        async mounted() {
            await this.getUsers();
        },
        methods: {
            moment: function (date = null) {
                return moment(date);
            },
            getTopGenres(num = 3) {
                const ratedGenres = this.genres.filter((genre) => genre.count);

                if (ratedGenres && ratedGenres.length > 0) {
                    return _.orderBy(this.genres, ['count'], ['desc']).slice(0, num);
                }

                return [];
            },
            getUnimportantGenres(num = 3) {
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
        }
    };
</script>

<style lang="sass">
    h2
        margin: 20px 0
</style>
