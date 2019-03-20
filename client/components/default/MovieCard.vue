<template>
    <b-col
        v-b-tooltip.hover
        :title="`${truncate(movie.plot, 300)}`"
        lg="2"
        md="3"
        sm="4"
        cols="6"
        class="movie-card"
    >
        <nuxt-link :to="`/movies/${movie.id}`">
            <div class="crop">
                <span
                    v-if="additionalInfo && movie.ratingsCount > 0"
                    class="avg-rating"
                >
                    <i class="el-icon-star-on"></i>
                    {{ averageRating }} / 5 ({{ movie.ratingsCount }} ratings)
                </span>
                <b-img
                    :src="image"
                    :alt="movie.title"
                    fluid
                ></b-img>
            </div>
            <div class="caption">
                <p>{{ truncate(movie.title, 20) }}</p>
                <p class="additional-info">
                    {{ movie.year }}
                </p>
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
            },
            additionalInfo: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        computed: {
            image() {
                const hasImage = this.movie.poster !== null && this.movie.poster !== '' && this.movie.poster !== 'N/A';
                return hasImage ? this.movie.poster : 'https://via.placeholder.com/160x200';
            },
            averageRating() {
                return Math.round(this.movie.avgRating);
            }
        },
        methods: {
            truncate(text, length = 30) {
                return text && text.length > length ? text.substring(0, length) + '...' : text;
            }
        }
    };
</script>

<style lang="sass" scoped>
    .movie-card
        margin-bottom: 10px
    .crop
        height: 200px
        position: relative
        overflow: hidden
        margin-bottom: 10px
        border: 1px solid #7f828b
    .caption
        color: #ffffff
        padding: 5px
        font-size: 12px
    .caption > p
        margin-bottom: 5px
    .caption .additional-info
        color: #7f828b
    a
        text-decoration: none
    .avg-rating
        position: absolute
        right: 5px
        top: 5px
        background: #000
        color: #fff
        padding: 5px
        font-size: 12px

    @media screen and (max-width: 1200px)
        .crop
            height: 180px

    @media screen and (max-width: 576px)
        .crop
            height: 250px

    @media screen and (max-width: 420px)
        .crop
            height: 180px
</style>
