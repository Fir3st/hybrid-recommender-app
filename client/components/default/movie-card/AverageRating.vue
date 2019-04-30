<template>
    <span
        v-if="additionalInfo && movie.ratingsCount > 0"
        class="avg-rating"
    >
        <i class="el-icon-star-on"></i>
        {{ averageRating }} / 5 ({{ movie.ratingsCount }})
    </span>
</template>

<script>
    export default {
        props: {
            additionalInfo: {
                type: Number,
                required: true
            },
            movie: {
                type: Object,
                required: true
            },
            averageRating: {
                type: Boolean,
                required: true
            }
        }
    };
</script>

<style lang="sass" scoped>
    .avg-rating
        position: absolute
        right: 5px
        top: 5px
        background: #000
        color: #fff
        padding: 5px
        font-size: 12px
</style>
