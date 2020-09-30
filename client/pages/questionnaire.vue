<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h1>{{ pageTitle }}</h1>
                </b-col>
            </b-row>
            <AddItemForm
                :movies="movies"
                :add-item-handler="addItem"
                :num-of-items="numOfItems"
            />
            <RatedMoviesGrid
                :movies="movies"
                :delete-handler="deleteMovieHandler"
                :change-rating-handler="changeRatingHandler"
                :penalize-handler="penalizeHandler"
            />
            <AddGenreForm
                :favourite-genres="favouriteGenres"
                :not-favourite-genres="notFavouriteGenres"
                :add-genre-handler="addGenre"
                :num-of-genres="numOfGenres"
            />
            <SelectedGenresGrid
                :favourite-genres="favouriteGenres"
                :not-favourite-genres="notFavouriteGenres"
                :delete-genre-handler="deleteGenre"
            />
            <b-row v-if="!sent">
                <b-col>
                    <b-button
                        variant="info"
                        :disabled="isButtonDisabled"
                        @click="submit"
                    >
                        <i
                            v-if="loading"
                            class="el-icon-loading"
                        ></i>
                        <span v-else>Send questionnaire</span>
                    </b-button>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col>
                    <nuxt-link
                        to="/results"
                        class="btn btn-info"
                    >
                        Continue to the next part
                    </nuxt-link>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import { mapGetters } from 'vuex';
    import RatedMoviesGrid from '~/components/default/questionnaire/RatedMoviesGrid';
    import AddItemForm from '~/components/default/questionnaire/AddItemForm';
    import AddGenreForm from "~/components/default/questionnaire/AddGenreForm";
    import SelectedGenresGrid from "~/components/default/questionnaire/SelectedGenresGrid";
    import { numOfGenres, numOfItems } from '~/utils/constants';

    export default {
        components: {
            RatedMoviesGrid,
            AddItemForm,
            AddGenreForm,
            SelectedGenresGrid
        },
        async asyncData ({ app }) {
            try {
                const user = await app.$axios.$get(`/users/${app.$auth.user.id}`);

                if (user) {
                    const movies = user.ratings.map((item) => {
                        return {
                            ...item.movie,
                            rating: item.rating,
                            penalized: item.rating === 0
                        };
                    });
                    const favouriteGenres = user.favouriteGenres.filter(item => item.type === 1).map(item => item.genreId);
                    const notFavouriteGenres = user.favouriteGenres.filter(item => item.type === -1).map(item => item.genreId);
                    return {
                        movies,
                        user,
                        favouriteGenres,
                        notFavouriteGenres
                    };
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        data() {
            return {
                pageTitle: 'Questionnaire',
                favouriteGenres: [],
                notFavouriteGenres: [],
                numOfGenres: numOfGenres,
                numOfItems: numOfItems,
                sent: false,
                loading: false
            };
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        computed: {
            ...mapGetters({
                genres: 'genres/genres'
            }),
            isButtonDisabled() {
                return this.movies.length < this.numOfItems
                || this.favouriteGenres.length < this.numOfGenres
                || this.notFavouriteGenres.length < this.numOfGenres
                || this.loading;
            }
        },
        methods: {
            deleteMovieHandler(id) {
                const movieIndex = this.movies.findIndex(item => item.id === id);
                if (movieIndex > -1) {
                    this.movies.splice(movieIndex, 1);
                }
            },
            changeRatingHandler(id, value) {
                const movieIndex = this.movies.findIndex(item => item.id === id);
                if (movieIndex > -1) {
                    this.movies[movieIndex].rating = value;
                }
            },
            penalizeHandler(id) {
                const movieIndex = this.movies.findIndex(item => item.id === id);
                if (movieIndex > -1) {
                    if (this.movies[movieIndex].penalized) {
                        this.movies[movieIndex].rating = 2.5;
                    } else {
                        this.movies[movieIndex].rating = 0;
                    }
                    this.movies[movieIndex].penalized = !this.movies[movieIndex].penalized;
                }
            },
            addItem(item) {
                const movieIndex = this.movies.findIndex(movie => movie.id === item.id);
                if (movieIndex === -1) {
                    this.movies = [
                        item,
                        ...this.movies
                    ];
                }
            },
            addGenre(id, type) {
                if (type === 'favourite') {
                    const index = this.favouriteGenres.findIndex(item => item === id);
                    const index2 = this.notFavouriteGenres.findIndex(item => item === id);
                    if (index === -1 && index2 === -1) {
                        this.favouriteGenres.push(id);
                    }

                } else {
                    const index = this.notFavouriteGenres.findIndex(item => item === id);
                    const index2 = this.favouriteGenres.findIndex(item => item === id);
                    if (index === -1 && index2 === -1) {
                        this.notFavouriteGenres.push(id);
                    }
                }
            },
            deleteGenre(id, type) {
                if (type === 'favourite') {
                    const index = this.favouriteGenres.findIndex(item => item === id);
                    if (index > -1) {
                        this.favouriteGenres.splice(index, 1);
                    }

                } else {
                    const index = this.notFavouriteGenres.findIndex(item => item === id);
                    if (index > -1) {
                        this.notFavouriteGenres.splice(index, 1);
                    }
                }
            },
            async submit() {
                const ratings = this.movies.map((item) => {
                    return {
                        id: item.id,
                        rating: item.rating
                    };
                });
                const userId = this.user.id;
                this.loading = true;
                try {
                    await this.$axios.$post(`/users/${userId}/questionnaire`, {
                        ratings,
                        favouriteGenres: this.favouriteGenres,
                        notFavouriteGenres: this.notFavouriteGenres
                    });
                    setTimeout(async() => {
                        this.$notify({
                            title: 'Success',
                            message: `You have successfully sent Questionnaire.`,
                            type: 'success',
                            position: 'bottom-right'
                        });
                        this.sent = true;
                        this.loading = false;
                    }, 15000);
                } catch (error) {
                    console.log(error.message);
                    this.$notify({
                        title: 'Error',
                        message: `Something went wrong with sending Questionnaire. Please try it again.`,
                        type: 'error',
                        position: 'bottom-right'
                    });
                    this.loading = false;
                }
            }
        },
    };
</script>

<style lang="sass" scoped>
    h1
        margin-bottom: 40px !important
</style>
