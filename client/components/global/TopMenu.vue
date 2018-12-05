<script>
    export default {
        computed: {
            isLogged() {
                return !!this.$auth.user;
            },
            isAdmin() {
                return this.$auth.user.admin;
            },
            userFullName() {
                const user = this.$auth.user;
                return user ? `${user.name} ${user.surname}` : '';
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
