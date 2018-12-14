<template>
    <div>
        <app-breadcrumb :items="breadcrumbs" />
        <b-row>
            <b-col>
                <h1>{{ pageTitle }}</h1>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import AdminPage from '~/components/admin/AdminPage';

    export default {
        extends: AdminPage,
        data() {
            return {
                pageTitle: 'Admin dashboard',
                breadcrumbs: [
                    { index: 0, name: 'dashboard', path: null }
                ]
            };
        }
    };
</script>
