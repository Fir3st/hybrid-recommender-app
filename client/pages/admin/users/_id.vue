<template>
    <div class="admin-page">
        <app-breadcrumb :items="breadcrumbs" />
        <b-row v-if="user">
            <b-col>
                <b-row>
                    <b-col>
                        <h1>{{ pageTitle }}</h1>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <user-detail-tab
                            :user="user"
                            :recommendations="recommendations"
                            :preferences="preferences"
                        />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-else>
            <b-col>
                <h1>User not found</h1>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import AdminPage from '~/components/admin/AdminPage';
    import UserDetailTab from '~/components/admin/users/UserDetailTab';

    export default {
        components: {
            UserDetailTab
        },
        extends: AdminPage,
        data() {
            return {
                breadcrumbs: [
                    { index: 0, name: 'users', path: '/admin/users' },
                    { index: 1, name: 'user detail' , path: null }
                ],
                recommendations: [],
                preferences: []
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
        },
        mounted() {
            if (this.user) {
                const promises = [];
                promises.push(this.$axios.$get(`/users/${this.user.id}/recommendations`));
                promises.push(this.$axios.$get(`/users/${this.user.id}/preferences`));

                Promise.all(promises).then((data) => {
                    this.recommendations = data[0];
                    this.preferences = data[1];
                });
            }
        }
    };
</script>
