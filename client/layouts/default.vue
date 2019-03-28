<template>
    <div id="main">
        <top-menu
            :movies-items="moviesItems"
            :series-items="seriesItems"
        />
        <b-container
            id="content"
        >
            <b-row>
                <b-col>
                    <nuxt />
                </b-col>
            </b-row>
        </b-container>
    </div>
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
    #main
        min-height: 100%
        background: #121212
        color: #ffffff
</style>

