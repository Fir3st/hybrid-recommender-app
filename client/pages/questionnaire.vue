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
            <b-row>
                <b-col>
                    <b-button
                        variant="info"
                        :disabled="isButtonDisabled"
                        @click="submit"
                    >
                        Send questionnaire
                    </b-button>
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

    export default {
        components: {
            RatedMoviesGrid,
            AddItemForm,
            AddGenreForm,
            SelectedGenresGrid
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        data() {
            return {
                pageTitle: 'Questionnaire',
                favouriteGenres: [],
                notFavouriteGenres: [],
                numOfGenres: 3,
                numOfItems: 20
            };
        },
        computed: {
            ...mapGetters({
                genres: 'genres/genres'
            }),
            isButtonDisabled() {
                return this.movies.length < this.numOfItems
                || this.favouriteGenres.length < this.numOfGenres
                || this.notFavouriteGenres.length < this.numOfGenres;
            }
        },
        async asyncData ({ app }) {
            try {
                const user = await app.$axios.$get(`/users/${app.$auth.user.id}`);

                if (user) {
                    const movies = user.ratings.map((item) => {
                        return {
                            ...item.movie,
                            rating: item.rating
                        };
                    });
                    return {
                        movies,
                        user
                    };
                }
            } catch (error) {
                console.log(error.message);
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
                    this.movies[movieIndex].rating = 0;
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
                // TODO: Finish submitting
                console.log('submitting');
            }
        },
    };
</script>

<style lang="sass" scoped>
    h1
        margin-bottom: 40px !important
</style>
