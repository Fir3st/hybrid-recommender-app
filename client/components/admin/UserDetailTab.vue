<template>
    <b-tabs>
        <b-tab
            title="User information"
            active>
            <user-detail :user="user" />
        </b-tab>
        <b-tab title="Already rated movies">
            <user-rated-movies :ratings="user.ratings" />
        </b-tab>
        <b-tab title="Analysis">
            <user-analysis />
        </b-tab>
    </b-tabs>
</template>

<script>
    import UserDetail from '~/components/admin/UserDetail';
    import UserRatedMovies from '~/components/admin/UserRatedMovies';
    import UserAnalysis from '~/components/admin/UserAnalysis';

    export default {
        components: {
            UserDetail,
            UserRatedMovies,
            UserAnalysis
        },
        props: {
            user: {
                type: Object,
                required: true
            }
        }
    };
</script>

<style lang="sass">
    .tab-content
        padding-top: 30px
</style>
