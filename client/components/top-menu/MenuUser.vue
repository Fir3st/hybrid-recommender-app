<template>
    <b-navbar-nav
        class="ml-auto">
        <template v-if="isLogged">
            <b-nav-text><strong>Logged user: </strong></b-nav-text>
            <b-nav-item-dropdown
                :text="userFullName"
                right>
                <b-dropdown-item
                    v-if="showAdminLink"
                    to="/admin">Admin dashboard</b-dropdown-item>
                <b-dropdown-item @click="handleLogout">Log out</b-dropdown-item>
            </b-nav-item-dropdown>
        </template>
        <b-nav-text v-else><nuxt-link to="/login">Log in</nuxt-link></b-nav-text>
    </b-navbar-nav>
</template>

<script>
    export default {
        props: {
            userFullName: {
                type: String,
                required: true,
                default: ''
            },
            handleLogout: {
                type: Function,
                required: true
            },
            isLogged: {
                type: Boolean,
                required: true
            },
            isAdmin: {
                type: Boolean,
                required: true
            }
        },
        computed: {
            showAdminLink() {
                return this.isAdmin && !this.$route.path.includes('admin');
            }
        }
    };
</script>

<style lang="sass" scoped>
    a .admin-link
       color: red
       text-decoration: underline
</style>
