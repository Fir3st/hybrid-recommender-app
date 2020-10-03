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
            b-row(v-if="!loading && analyzedGenres.length", class="mt-2 mb-2")
                b-col
                    h3 Favourite genres
                    b-table(striped, hover, :items="analyzedGenres.slice(0, 3)")

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
            analyzedGenres() {
                return _.orderBy(this.genres, ['avg'], ['desc']);
            }
        },
        async mounted() {
            await this.getUsers();
        },
        methods: {
            moment: function (date = null) {
                return moment(date);
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
                try {
                    const url = `/users/${this.userId}/analyze`;

                    const response = await this.$axios.$get(url);
                    console.log(response);

                    if (response.genres && response.genres.length) {
                        this.genres = response.genres;
                    }
                    if (response.ratings && response.ratings.length) {
                        this.favouriteItems = response.ratings;
                    }
                } catch (error) {
                    console.log(error.message);
                }
            },
        }
    };
</script>

<style lang="sass">
    h2
        margin: 20px 0
</style>
