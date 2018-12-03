<template>
    <b-col
        sm="2"
    >
        <b-card
            :title="movie.title"
            :img-src="movie.poster"
            :img-alt="movie.title"
            img-top
            style="max-width: 20rem;"
            class="mb-2">
            <p class="card-text">
                {{ movie.plot | truncate(100) }}
            </p>
            <nuxt-link
                :to="`/movies/${movie.id}`"
                class="class-link">More</nuxt-link>
        </b-card>
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
    .card-img-top
        max-height: 260px
</style>
