<template>
    <span
        v-if="rating && isLogged"
        class="rating"
    >
        Pr. rating: {{ Number.parseFloat(movie.rating).toFixed(4) }}
    </span>
</template>

<script>
    export default {
        props: {
            rating: {
                type: Boolean,
                required: true
            },
            movie: {
                type: Object,
                required: true
            }
        }
    };
</script>

<style lang="sass" scoped>
    .rating
        position: absolute
        left: 5px
        bottom: 5px
        background: #000
        color: #fff
        padding: 5px
        font-size: 12px
        z-index: 999
</style>
