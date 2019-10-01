<template>
    <div class="admin-page">
        <app-breadcrumb :items="breadcrumbs" />
        <b-row>
            <b-col>
                <h1>{{ pageTitle }}</h1>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import AdminPage from '~/components/admin/AdminPage';

    export default {
        components: {
        },
        extends: AdminPage,
        data() {
            return {
                pageTitle: 'Algorithms playground',
                breadcrumbs: [
                    { index: 0, name: 'playground', path: null }
                ]
            };
        },
        computed: {
        },
        async fetch({ store }) {
        }
    };
</script>

<style lang="sass" scoped>
    h2
        margin: 20px 0
</style>
