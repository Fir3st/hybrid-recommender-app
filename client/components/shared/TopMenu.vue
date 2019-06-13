<script>
    export default {
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
