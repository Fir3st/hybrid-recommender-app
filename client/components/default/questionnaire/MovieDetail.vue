<template>
    <b-row class="movie-detail">
        <b-col
            class="align-self-center"
            md="2"
        >
            <b-img
                :src="image"
                fluid
                :alt="movie.title"
                width="150px"
            />
        </b-col>
        <b-col
            md="10"
        >
            <h3>{{ movie.title }}</h3>
            <p>{{ movie.genres.map(item => item.name).join(', ') }}</p>
            <p>{{ movie.plot }}</p>
            <b-button
                variant="info"
                @click="addItemHandler"
            >
                Add to selected movies
            </b-button>
            <b-button
                variant="info"
                @click="addPenalizedItemHandler"
            >
                Add to selected movies as penalized
            </b-button>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            movie: {
                type: Object,
                required: true
            },
            addItemHandler: {
                type: Function,
                required: true
            },
            addPenalizedItemHandler: {
                type: Function,
                required: true
            }
        },
        computed: {
            image() {
                const hasImage = this.movie.poster !== null && this.movie.poster !== '' && this.movie.poster !== 'N/A';
                return hasImage ? this.movie.poster : '://via.placeholder.com/160x200';
            }
        },
    };
</script>

<style lang="sass" scoped>
    .movie-detail
        margin-bottom: 40px
</style>
