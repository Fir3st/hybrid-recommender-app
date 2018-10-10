<template>
    <b-container
        fluid>
        <b-row
            align-v="center"
            class="justify-content-md-center">
            <b-col md="4">
                <nuxt />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
    };
</script>

<style lang="sass" scoped>
    .container-fluid
        min-height: 100%
        display: flex
        background: #2d3a4b
    .row
        width: 100%
</style>
