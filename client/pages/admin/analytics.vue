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
            <b-col>
                <h2>Ratings distribution</h2>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <ratings-distribution :ratings-distribution="ratingsDistribution" />
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import AdminPage from '~/components/admin/AdminPage';
    import RatingsDistribution from '~/components/admin/analytics/RatingsDistributionChart';

    export default {
        components: {
            RatingsDistribution
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
        computed: {
            ...mapGetters({
                usersCount: 'users/count',
                moviesCount: 'movies/count',
                ratingsDistribution: 'ratings/distribution'
            })
        },
        async fetch({ store }) {
            await store.dispatch('users/setCount');
            await store.dispatch('movies/setCount');
            await store.dispatch('ratings/setRatingsDistribution');
        }
    };
</script>

<style lang="sass" scoped>
    h2
        margin: 20px 0
</style>
