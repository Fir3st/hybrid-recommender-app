<template>
    <b-container fluid>
        <b-container fluid>
            <top-menu
                :movies-items="moviesItems"
                :series-items="seriesItems"
            />
        </b-container>
        <b-container>
            <nuxt />
        </b-container>
    </b-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import TopMenu from '~/components/default/TopMenu.vue';

    export default {
        components: {
            TopMenu
        },
        computed: {
            ...mapGetters({
                moviesGenres: 'genres/moviesGenres',
                seriesGenres: 'genres/seriesGenres'
            }),
            moviesItems() {
                return this.moviesGenres.filter(item => item.name !== 'N/A');
            },
            seriesItems() {
                return this.seriesGenres.filter(item => item.name !== 'N/A');
            }
        }
    };
</script>

<style lang="sass" scoped>
    .container-fluid
        min-height: 100%
        background: #121212
        color: #ffffff
        padding: 0
    .top-menu
        padding: 0
</style>

