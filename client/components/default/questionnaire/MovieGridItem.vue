<template>
    <b-row
        :key="movie.id"
        class="movie-row"
    >
        <b-col class="align-self-center">
            <b-img
                :src="image"
                fluid
                :alt="movie.title"
                width="75px"
            />
        </b-col>
        <b-col class="align-self-center">
            <nuxt-link :to="`/detail/${movie.id}`">
                #{{ movie.id }}
            </nuxt-link>
        </b-col>
        <b-col class="align-self-center">
            {{ movie.title }}
        </b-col>
        <b-col class="align-self-center">
            <el-rate
                v-if="!movie.penalized"
                :value="rating"
                :allow-half="true"
                show-score
                text-color="#ff9900"
                score-template="{value} points"
                @change="changeRating"
            />
        </b-col>
        <b-col class="align-self-center">
            <el-button
                :type="movie.penalized ? 'success' : 'danger'"
                icon="el-icon-close"
                circle
                :title="movie.penalized ? 'Cancel the penalty' : 'Penalize'"
                @click="penalize"
            />
            <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteItem"
            />
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
            rating: {
                type: Number,
                required: true
            },
            deleteHandler: {
                type: Function,
                required: true
            },
            changeRatingHandler: {
                type: Function,
                required: true
            },
            penalizeHandler: {
                type: Function,
                required: true
            }
        },
        computed: {
            image() {
                const hasImage = this.movie.poster !== null && this.movie.poster !== '' && this.movie.poster !== 'N/A';
                return hasImage ? this.movie.poster : '://via.placeholder.com/160x200';
            },
        },
        methods: {
            deleteItem() {
                this.deleteHandler(this.movie.id);
            },
            changeRating(value) {
                this.changeRatingHandler(this.movie.id, value);
            },
            penalize() {
                this.penalizeHandler(this.movie.id);
            }
        }
    };
</script>

<style lang="sass" scoped>
    .movie-row
        min-height: 50px
    .col
        vertical-align: center
</style>
