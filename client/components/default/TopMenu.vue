<template>
    <b-navbar
        sticky
        toggleable="md"
        type="dark"
        variant="dark"
        class="front-nav"
    >
        <b-container>
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand to="/">
                <img
                    src="../../assets/images/logo-blue.png"
                    alt="Logo"
                    width="120"
                />
            </b-navbar-brand>
            <b-collapse
                id="nav_collapse"
                is-nav
            >
                <b-navbar-nav>
                    <b-nav-item-dropdown
                        text="Movies"
                        right
                    >
                        <b-dropdown-item
                            to="/movies"
                            exact
                        >
                            All movies
                        </b-dropdown-item>
                        <b-dropdown-item
                            v-for="item in moviesItems"
                            :key="item.id"
                            :to="`/movies/${item.name.toLowerCase()}`"
                            exact
                        >
                            {{ item.name }}
                        </b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item-dropdown
                        text="Series"
                        right
                    >
                        <b-dropdown-item
                            to="/series"
                            exact
                        >
                            All series
                        </b-dropdown-item>
                        <b-dropdown-item
                            v-for="item in seriesItems"
                            :key="item.id"
                            :to="`/series/${item.name.toLowerCase()}`"
                            exact
                        >
                            {{ item.name }}
                        </b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item to="/search">
                        Search
                    </b-nav-item>
                </b-navbar-nav>
                <menu-user
                    :user-full-name="userFullName"
                    :is-logged="isLogged"
                    :is-admin="isAdmin"
                    :handle-logout="handleLogout"
                />
            </b-collapse>
        </b-container>
    </b-navbar>
</template>

<script>
    import TopMenu from '~/components/shared/TopMenu';
    import MenuUser from '~/components/shared/MenuUser';

    export default {
        components: {
            MenuUser
        },
        extends: TopMenu,
        props: {
            moviesItems: {
                type: Array,
                required: true
            },
            seriesItems: {
                type: Array,
                required: true
            }
        }
    };
</script>

<style lang="sass">
    .bg-dark
        background: #121212 !important
    .front-nav
        .dropdown-item
            background: #232323 !important
            color: white !important
        .dropdown-item:hover
            background: #17a2b8 !important
        .navbar-nav .dropdown-menu
            background-color: #232323 !important
        .name
            font-family: 'Roboto Condensed', sans-serif
</style>
