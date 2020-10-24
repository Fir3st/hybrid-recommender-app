<template>
    <div class="admin-page">
        <app-breadcrumb :items="breadcrumbs" />
        <b-row>
            <b-col>
                <h1>{{ pageTitle }}</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="2">
                Total number of users:
            </b-col>
            <b-col sm="10">
                {{ usersCount }}
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="2">
                Total number of movies:
            </b-col>
            <b-col sm="10">
                {{ moviesCount }}
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="2">
                Total number of ratings:
            </b-col>
            <b-col sm="10">
                {{ ratingsCount }}
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <h2>Ratings distribution (by value)</h2>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <values-distribution :distribution="valuesDistribution" />
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <h2>Ratings distribution (frequency)</h2>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <frequency-distribution :distribution="frequencyDistribution" />
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <h2>Similarities distribution</h2>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <similarities-distribution :similarities="similaritiesDistribution" />
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import AdminPage from '~/components/admin/AdminPage';
    import ValuesDistribution from '~/components/admin/analytics/ValuesDistribution';
    import SimilaritiesDistribution from '~/components/admin/analytics/SimilaritiesDistribution';
    import FrequencyDistribution from '~/components/admin/analytics/FrequencyDistribution';
    export default {
        components: {
            ValuesDistribution,
            SimilaritiesDistribution,
            FrequencyDistribution
        },
        extends: AdminPage,
        data() {
            return {
                pageTitle: 'Analytics board',
                breadcrumbs: [
                    { index: 0, name: 'analytics', path: null }
                ]
            };
        },
        async fetch({ store }) {
            await store.dispatch('users/setCount');
            await store.dispatch('movies/setCount');
            await store.dispatch('ratings/setCount');
            await store.dispatch('ratings/setValuesDistribution');
            await store.dispatch('ratings/setFrequencyDistribution');
            await store.dispatch('similarities/setDistributions');
        },
        computed: {
            ...mapGetters({
                usersCount: 'users/count',
                moviesCount: 'movies/count',
                ratingsCount: 'ratings/count',
                valuesDistribution: 'ratings/valuesDistribution',
                frequencyDistribution: 'ratings/frequencyDistribution',
                similaritiesDistribution: 'similarities/distribution'
            })
        },
    };
</script>

<style lang="sass" scoped>
    h2
        margin: 20px 0
</style>
