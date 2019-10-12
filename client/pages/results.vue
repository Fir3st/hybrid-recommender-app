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
                    <Stepper
                        :active-tab="activeTab"
                        :settings="settings"
                        :next-tab-handler="nextTab"
                        :previous-tab-handler="previousTab"
                        :change-settings-handler="changeSettings"
                        :genres="genres"
                    />
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { numOfGenres, numOfItems, cbRecTypes, cbfRecTypes, similarityTypes, movieTypes, hybridTypes } from '~/utils/constants';
    import Stepper from "~/components/default/results/Stepper";

    export default {
        components: {
            Stepper
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        data() {
            return {
                pageTitle: 'Results',
                numOfGenres: numOfGenres,
                numOfItems: numOfItems,
                activeTab: 0,
                settings: {
                    general: {
                        movieId: 1,
                        take: 50,
                    },
                    cb: {
                        recType: null,
                        recTypes: [
                            { value: null, text: 'Please select an algorithm' },
                            ...cbRecTypes
                        ],
                        orderBy: null,
                        orderByOptions: [
                            { value: null, text: 'Please select columns for sorting and their order' },
                            { value: 'similarity', text: 'Only Similarity' },
                            { value: 'es_score', text: 'Only Expert system score' },
                            { value: 'similarity,es_score', text: 'Similarity, Expert system score (default)' },
                            { value: 'es_score,similarity', text: 'Expert system score, Similarity' },
                        ]
                    },
                    cbf: {
                        recType: null,
                        recTypes: [
                            { value: null, text: 'Please select an algorithm' },
                            ...cbfRecTypes
                        ],
                        similarityType: null,
                        similarityTypes: [
                            { value: null, text: 'Please select a similarity function' },
                            ...similarityTypes
                        ],
                        similaritySource: null,
                        similaritySources: [
                            { value: null, text: 'Please select an algorithm' },
                            ...cbRecTypes
                        ],
                        genre: null,
                        movieType: null,
                        movieTypes:  [
                            { value: null, text: 'Please select a movie type' },
                            ...movieTypes
                        ],
                        orderBy: null,
                        orderByOptions: [
                            { value: null, text: 'Please select columns for sorting and their order' },
                            { value: 'rating', text: 'Only predicted rating' },
                            { value: 'es_score', text: 'Only Expert system score' },
                            { value: 'rating,es_score', text: 'Predicted rating, Expert system score (default)' },
                            { value: 'es_score,rating', text: 'Expert system score, Predicted rating' },
                        ]
                    },
                    hybrid: {
                        hybridType: null,
                        hybridTypes: [
                            { value: null, text: 'Please select a hybrid hype' },
                            ...hybridTypes
                        ],
                        recType: null,
                        recTypes: [
                            { value: null, text: 'Please select a collaborative algorithm' },
                            ...cbfRecTypes
                        ],
                        similarityType: null,
                        similarityTypes: [
                            { value: null, text: 'Please select a similarity function for collaborative filtering' },
                            ...similarityTypes
                        ],
                        similaritySource: null,
                        similaritySources: [
                            { value: null, text: 'Please select a content-based algorithm' },
                            ...cbRecTypes
                        ],
                        genre: null,
                        movieType: null,
                        movieTypes:  [
                            { value: null, text: 'Please select a movie type' },
                            ...movieTypes
                        ],
                        orderBy: null,
                        orderByOptions: [
                            { value: null, text: 'Please select columns for sorting and their order' },
                            { value: 'similarity,rating', text: 'Only predicted rating/similarity' },
                            { value: 'es_score', text: 'Only Expert system score' },
                            { value: 'similarity,rating,es_score', text: 'Predicted rating/Similarity, Expert system score (default)' },
                            { value: 'es_score,similarity,rating', text: 'Expert system score, Predicted rating/Similarity' },
                        ],
                    }
                }
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
        methods: {
            nextTab() {
                if (this.activeTab <= Object.keys(this.settings).length) this.activeTab++;
            },
            previousTab() {
                if (this.activeTab > 0) this.activeTab--;
            },
            changeSettings(type, name, value) {
                this.settings[type][name] = value;
            },
            async showResults() {
                console.log('showing results');
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
