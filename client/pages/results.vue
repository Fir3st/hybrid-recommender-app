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
                    />
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import { numOfGenres, numOfItems } from '~/utils/constants';
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
                    cb: {
                        id: 1,
                        take: 50,
                        recType: null,
                        recTypes: [
                            { value: null, text: 'Please select an algorithm' },
                            { value: 'tf-idf', text: 'TF-IDF (default)' },
                            { value: 'lda', text: 'LDA' },
                        ],
                        orderBy: null,
                        orderByOptions: [
                            { value: null, text: 'Please select columns for sorting and their order' },
                            { value: 'similarity', text: 'Only Similarity' },
                            { value: 'es_score', text: 'Only Expert system score' },
                            { value: 'similarity,es_score', text: 'Similarity, Expert system score (default)' },
                            { value: 'es_score,similarity', text: 'Expert system score, Similarity' },
                        ]
                    }
                }
            };
        },
        computed: {
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
                if (this.activeTab <= 3) this.activeTab++;
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
