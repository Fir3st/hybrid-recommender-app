<template>
    <b-navbar-nav
        class="ml-auto"
    >
        <template v-if="isLogged">
            <b-nav-text><strong>Logged user: </strong></b-nav-text>
            <b-nav-item-dropdown
                :text="userFullName"
                right
            >
                <b-dropdown-item
                    v-if="showAdminLink"
                    class="admin-link"
                    to="/admin"
                    exact
                >
                    Admin dashboard
                </b-dropdown-item>
                <b-dropdown-item
                    v-if="showFrontpageLink"
                    class="admin-link"
                    to="/"
                    exact
                >
                    Return to front page
                </b-dropdown-item>
                <b-dropdown-item @click="handleLogout">
                    Log out
                </b-dropdown-item>
            </b-nav-item-dropdown>
        </template>
        <b-nav-text v-else>
            <nuxt-link to="/login">
                Log in
            </nuxt-link>
            |
            <nuxt-link to="/register">
                Register
            </nuxt-link>
        </b-nav-text>
    </b-navbar-nav>
</template>

<script>
    export default {
        props: {
            handleLogout: {
                type: Function,
                required: true
            }
        },
        computed: {
            showAdminLink() {
                return this.isAdmin && !this.$route.path.includes('admin');
            },
            showFrontpageLink() {
                return this.$route.path.includes('admin');
            }
        }
    };
</script>

<style lang="sass" scoped>
    .admin-link
        font-weight: bold
</style>
