<template>
    <b-col
        sm="2"
    >
        <nuxt-link :to="`/movies/${movie.id}`">
            <div class="crop">
                <b-img-lazy
                    :src="movie.poster"
                    :alt="movie.title"
                    blank-color="#bbb"
                    fluid />
                <div class="caption">{{ movie.title }}</div>
            </div>
        </nuxt-link>
    </b-col>
</template>

<script>
    export default {
        props: {
            movie: {
                type: Object,
                required: true,
                default: null
            }
        }
    };
</script>

<style lang="sass" scoped>
    .crop
        height: 260px
        position: relative
        overflow: hidden
        margin-bottom: 20px
    .caption
        position: absolute
        left: 0
        bottom: 0
        right: 0
        background: rgba(0,0,0,0.6)
        color: #ffffff
        font-weight: bold
        padding: 10px
        text-align: center
</style>
