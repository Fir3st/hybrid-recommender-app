<template>
    <b-navbar
        sticky
        toggleable="md"
        type="dark"
        variant="info">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/">HRA</b-navbar-brand>
        <b-collapse
            id="nav_collapse"
            is-nav>
            <b-navbar-nav>
                <b-nav-item to="/admin">Dashboard</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-text><strong>Logged user: </strong></b-nav-text>
                <b-nav-item-dropdown
                    :text="userFullName"
                    right>
                    <b-dropdown-item href="#">My account</b-dropdown-item>
                    <b-dropdown-item href="#">Settings</b-dropdown-item>
                    <b-dropdown-item @click="handleLogout">Log out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    export default {
        computed: {
            isAdmin() {
                return this.$auth.user.admin;
            },
            userFullName() {
                const user = this.$auth.user;
                return `${user.name} ${user.surname}`;
            }
        },
        methods: {
            async handleLogout() {
                await this.$auth.logout();
                this.$notify({
                    title: 'Success',
                    message: 'You have been successfully logged off from system.',
                    type: 'success',
                    position: 'bottom-right'
                });
            }
        }
    };
</script>

<style lang="sass" scoped>
</style>
