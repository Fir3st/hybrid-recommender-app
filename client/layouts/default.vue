<template>
    <b-container fluid>
        <b-container fluid>
            <top-menu />
        </b-container>
        <b-container>
            <nuxt />
        </b-container>
    </b-container>
</template>

<script>
    import TopMenu from '~/components/default/TopMenu.vue';

    export default {
        components: {
            TopMenu
        }
    };
</script>

<style lang="sass" scoped>
    .container-fluid
        min-height: 100%
        background: #090909
        color: #ffffff
        padding: 0
    .top-menu
        padding: 0
</style>

