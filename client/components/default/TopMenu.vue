<template>
    <b-navbar
        sticky
        toggleable="md"
        type="dark"
        variant="dark">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/">HRA</b-navbar-brand>
        <b-collapse
            id="nav_collapse"
            is-nav>
            <b-navbar-nav>
                <b-nav-item to="/">Home</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    export default {
    };
</script>

<style lang="sass" scoped>
</style>
