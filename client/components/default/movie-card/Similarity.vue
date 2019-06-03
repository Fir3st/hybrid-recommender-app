<template>
    <span
        v-if="similarity"
        class="similarity"
    >
        Sim: {{ movie.similarity }}
    </span>
</template>

<script>
    export default {
        props: {
            similarity: {
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
    .similarity
        position: absolute
        left: 5px
        bottom: 5px
        background: #000
        color: #fff
        padding: 5px
        font-size: 12px
        z-index: 999
</style>
