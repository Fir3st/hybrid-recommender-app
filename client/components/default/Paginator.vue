<template>
    <div>
        <button
            :disabled="skip <= 0"
            @click="prevMovies">Prev</button>
        <button
            :disabled="(skip + take) > count"
            @click="nextMovies">Next</button>
    </div>
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
                setPagination: 'movies/setPagination',
            }),
            prevMovies() {
                if ((this.skip - this.take) >= 0) {
                    this.setPagination(this.skip - this.take);
                }
            },
            nextMovies() {
                if ((this.skip + this.take) < this.count) {
                    this.setPagination(this.skip + this.take);
                }
            }
        }
    };
</script>
