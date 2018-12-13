<template>
    <b-row
        id="pagination"
        class="text-center">
        <b-col>
            <b-button-group>
                <b-button
                    :disabled="skip <= 0"
                    @click="prevMovies">Prev</b-button>
                <b-button
                    :disabled="(skip + take) > count"
                    @click="nextMovies">Next</b-button>
            </b-button-group>
        </b-col>
    </b-row>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
        computed: {
            ...mapGetters({
                take: 'movies/take',
                skip: 'movies/skip',
                count: 'movies/count'
            })
        },
        methods: {
            ...mapActions({
                setSkip: 'movies/setSkip',
            }),
            prevMovies() {
                if ((this.skip - this.take) >= 0) {
                    this.setSkip(this.skip - this.take);
                }
            },
            nextMovies() {
                if ((this.skip + this.take) < this.count) {
                    this.setSkip(this.skip + this.take);
                }
            }
        }
    };
</script>

<style lang="sass" scoped>
    #pagination
        padding: 20px 0
</style>
