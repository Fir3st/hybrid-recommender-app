<template>
    <b-navbar
        toggleable="md"
        type="dark"
        variant="dark">
        <b-container>
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand to="/">Recommender</b-navbar-brand>
            <b-collapse
                id="nav_collapse"
                is-nav>
                <b-navbar-nav>
                    <b-nav-item
                        to="/movies"
                        exact>Movies</b-nav-item>
                    <b-nav-item
                        to="/series"
                        exact>Series</b-nav-item>
                </b-navbar-nav>
                <menu-user
                    :user-full-name="userFullName"
                    :is-logged="isLogged"
                    :is-admin="isAdmin"
                    :handle-logout="handleLogout" />
            </b-collapse>
        </b-container>
    </b-navbar>
</template>

<script>
    import TopMenu from '~/components/global/TopMenu';
    import MenuUser from '~/components/global/MenuUser';

    export default {
        components: {
            MenuUser
        },
        extends: TopMenu
    };
</script>

<style lang="sass" scoped>
    .bg-dark
        background-color: #232323 !important
    .nav-link
        text-transform: uppercase
</style>
