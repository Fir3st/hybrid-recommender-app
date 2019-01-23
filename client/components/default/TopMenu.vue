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
                    <b-nav-item-dropdown
                        text="Movies"
                        right>
                        <b-dropdown-item
                            to="/movies"
                            exact>All movies</b-dropdown-item>
                        <b-dropdown-item
                            v-for="item in moviesItems"
                            :key="item.id"
                            :to="`/movies/genre/${item.name}`"
                            exact>{{ item.name }}</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item-dropdown
                        text="Series"
                        right>
                        <b-dropdown-item
                            to="/series"
                            exact>All series</b-dropdown-item>
                        <b-dropdown-item
                            v-for="item in seriesItems"
                            :key="item.id"
                            :to="`/series/genre/${item.name}`"
                            exact>{{ item.name }}</b-dropdown-item>
                    </b-nav-item-dropdown>
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
        extends: TopMenu,
        props: {
            moviesItems: {
                type: Array | null,
                required: true
            },
            seriesItems: {
                type: Array | null,
                required: true
            }
        }
    };
</script>

<style lang="sass" scoped>
    .bg-dark
        background-color: #232323 !important
    .nav-link
        text-transform: uppercase
</style>
