<template>
    <b-row v-if="isLogged">
        <b-col>
            <h2>Rate this movie</h2>
            <el-rate
                :value="rating"
                :allow-half="true"
                show-score
                text-color="#ff9900"
                score-template="{value} points"
                @change="rateMovie">
            </el-rate>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            isLogged: {
                type: Boolean,
                required: true
            },
            userRating: {
                type: Number,
                required: true
            },
            rateMovie: {
                type: Function,
                required: true
            }
        },
        computed: {
            rating() {
                return this.userRating;
            }
        }
    };
</script>

<style lang="sass" scoped>
    h2
        padding: 20px 0
</style>
