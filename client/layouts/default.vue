<template>
    <b-container
        fluid>
        <b-row xs="12">
            <b-col class="top-menu">
                <top-menu />
            </b-col>
        </b-row>
        <nuxt />
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
        background: #3e4247
        color: #ffffff
    .top-menu
        padding: 0
</style>

