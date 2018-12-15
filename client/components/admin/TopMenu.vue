<template>
    <b-navbar
        sticky
        toggleable="md"
        type="dark"
        variant="info">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/admin">Recommender</b-navbar-brand>
        <b-collapse
            id="nav_collapse"
            is-nav>
            <b-navbar-nav>
                <b-nav-item to="/admin/users">Users</b-nav-item>
            </b-navbar-nav>
            <menu-user
                :user-full-name="userFullName"
                :is-logged="isLogged"
                :is-admin="isAdmin"
                :handle-logout="handleLogout" />
        </b-collapse>
    </b-navbar>
</template>

<script>
    import TopMenu from '~/components/global/TopMenu';
    import MenuUser from '~/components/global/MenuUser';

    export default {
        components: {
            MenuUser
        },
        extends: TopMenu,
    };
</script>

<style lang="sass" scoped>
</style>
