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
                type: Boolean,
                required: true
            },
            movie: {
                type: Object,
                required: true
            },
            averageRating: {
                type: String,
                required: true
            }
        }
    };
</script>

<style lang="sass">
    .avg-rating
        position: absolute
        right: 5px
        top: 5px
        background: #000
        color: #fff
        padding: 5px
        font-size: 12px
        z-index: 999
</style>
