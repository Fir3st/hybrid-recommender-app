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
    import AdminPage from '~/components/admin/AdminPage';

    export default {
        extends: AdminPage,
        data() {
            return {
                breadcrumbs: [
                    { index: 0, name: 'users', path: '/admin/users' },
                    { index: 1, name: 'user detail' , path: null }
                ]
            };
        },
        computed: {
            pageTitle() {
                return (this.user && this.user.name && this.user.surname) ? `${this.user.name} ${this.user.surname}` : 'Detail';
            }
        },
        async asyncData ({ app, params }) {
            try {
                const user = await app.$axios.$get(`/users/${params.id}`);

                if (user) {
                    return {
                        user
                    };
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    };
</script>
