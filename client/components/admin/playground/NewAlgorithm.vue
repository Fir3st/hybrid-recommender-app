<template lang="pug">
    b-row
        b-col
            b-row
                b-col
                    h2 New Algorithm
            b-row
                b-col
                    b-form
                        label(for="toTake") Number of recommendations
                        b-form-input(v-model="toTake", type="number", id="toTake", name="toTake", min="1")
                        b-form-group(id="userId", label="User", label-for="userId")
                            b-form-select(id="userId", v-model="userId", :options="options", required, placeholder="Select user to analyze")
                        b-button(type="button", :disabled="!userId", @click="analyzeUser", variant="primary") Analyze user
                        b-button(type="button", :disabled="!userId", @click="getRecommendations", variant="secondary", class="ml-2") Get recommended movies
            Loading(v-if="loading")
            b-row(v-if="!loading && favouriteItems.length", class="mt-2 mb-2")
                b-col
                    h3 Favourite movies and series
                    b-table(striped, hover, :items="favouriteItems", :fields="favouriteItemsFields")
                        template(v-slot:cell(#)="data") {{ data.index + 1 }}
                        template(v-slot:cell(usersRatings[0].createdAt)="data") {{ moment(data.item.usersRatings[0].createdAt).format('DD. MM. YYYY HH:mm:ss') }}
            b-row(v-if="!loading && movies.length", class="mt-2 mb-2")
                b-col
                    h3 Recommended movies
                    p Relevant: {{ relevantCount }}
                    p Not relevant: {{ notRelevantCount }}
                    p Precision: {{ precision }}
                    p Recall (TOP 10): {{ recall10 }}
                    p F1-Measure (TOP 10): {{ f1Measure10 }}
                    p Recall (TOP 15): {{ recall15 }}
                    p F1-Measure (TOP 15): {{ f1Measure15 }}
                    b-table(striped, hover, :items="movies", :fields="moviesFields")
                        template(v-slot:cell(#)="data") {{ data.index + 1 }}
            b-row(v-if="!loading && mostRatedGenres.length", class="mt-2 mb-2")
                b-col
                    h3 Most rated genres
                    b-table(striped, hover, :items="mostRatedGenres")
            b-row(v-if="!loading && mostValuedGenres.length", class="mt-2 mb-2")
                b-col
                    h3 Most valued genres
                    b-table(striped, hover, :items="mostValuedGenres")
            b-row(v-if="!loading && leastRatedGenres.length", class="mt-2 mb-2")
                b-col
                    h3 Least rated genres
                    b-table(striped, hover, :items="leastRatedGenres")
            b-row(v-if="!loading && leastValuedGenres.length", class="mt-2 mb-2")
                b-col
                    h3 Least valued genres
                    b-table(striped, hover, :items="leastValuedGenres")
            b-row(v-if="!loading && mostRatedGenresAll.length", class="mt-2 mb-2")
                b-col
                    h3 Most rated genres (12)
                    b-table(striped, hover, :items="mostRatedGenresAll")
            b-row(v-if="!loading && mostValuedGenresAll.length", class="mt-2 mb-2")
                b-col
                    h3 Most valued genres (12)
                    b-table(striped, hover, :items="mostValuedGenresAll")
            b-row(v-if="!loading && leastRatedGenresAll.length", class="mt-2 mb-2")
                b-col
                    h3 Least rated genres (12)
                    b-table(striped, hover, :items="leastRatedGenresAll")
            b-row(v-if="!loading && leastValuedGenresAll.length", class="mt-2 mb-2")
                b-col
                    h3 Least valued genres (12)
                    b-table(striped, hover, :items="leastValuedGenresAll")

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
                moviesFields: [
                    '#',
                    { key: 'id', label: 'ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'predictedRating', label: 'Rating' },
                    { key: 'similarity', label: 'Similarity' },
                    { key: 'relevant', label: 'Relevant' }
                ],
                genres: [],
                movies: [],
                toTake: 25,
                relevantCount: null,
                notRelevantCount: null,
                precision: null,
                recall10: null,
                recall15: null,
                f1Measure10: null,
                f1Measure15: null
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
                this.favouriteItems = [];
                this.genres = [];

                try {
                    await this.analyzeUser();
                    this.loading = true;
                    const url = `/playground/users/${this.userId}?take=${this.toTake}`;

                    const response = await this.$axios.$get(url);

                    if (response && response.length) {
                        this.movies = response;
                        const relevance = this.getRelevance(this.movies, this.mostRatedGenresAll, this.leastRatedGenresAll);
                        this.relevantCount = this.getRelevantCount(relevance);
                        this.notRelevantCount = this.toTake - this.relevantCount;
                        this.precision = this.getFinalScore(this.toTake, this.relevantCount);
                        this.recall10 = this.getRecallScore(relevance, 10);
                        this.recall15 = this.getRecallScore(relevance, 15);
                        this.f1Measure10 = this.getFMeasureScore(relevance, this.toTake, 10);
                        this.f1Measure15 = this.getFMeasureScore(relevance, this.toTake, 15);
                        this.movies = this.movies.map((movie) => {
                            const relevanceForItem = relevance.find(item => item.id === movie.id);

                            return { ...movie, relevant: relevanceForItem ? relevanceForItem.relevant : null };
                        });
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
