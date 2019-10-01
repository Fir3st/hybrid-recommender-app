<template>
    <div class="admin-page">
        <app-breadcrumb :items="breadcrumbs" />
        <b-row>
            <b-col>
                <h1>{{ pageTitle }}</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <PlaygroundTab />
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import AdminPage from '~/components/admin/AdminPage';
    import PlaygroundTab from '~/components/admin/playground/PlaygroundTab';

    export default {
        components: {
            PlaygroundTab
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
