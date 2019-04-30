<template>
    <b-col
        lg="2"
        md="3"
        sm="4"
        cols="6"
        class="movie-card"
    >
        <div class="crop">
            <average-rating
                :movie="movie"
                :average-rating="averageRating"
                :additional-info="additionalInfo"
            />
            <rating-buttons
                :movie="movie"
                :show-rating-buttons="showRatingButtons"
            />
            <nuxt-link
                :id="`card-${movie.id}`"
                :to="`/detail/${movie.id}`"
            >
                <b-img
                    :src="image"
                    :alt="movie.title"
                    fluid
                ></b-img>
            </nuxt-link>
        </div>
        <div class="caption">
            <nuxt-link
                :to="`/detail/${movie.id}`"
            >
                <p>{{ truncate(movie.title, 20) }}</p>
            </nuxt-link>
            <p class="additional-info">
                {{ movie.year }}
            </p>
        </div>

        <b-popover
            :target="`card-${movie.id}`"
            triggers="hover"
            class="hidden-sm-and-down"
        >
            <template slot="title">
                {{ movie.title }}
            </template>
            <p class="tooltip-caption">
                <span>{{ movie.year }}</span>
            </p>
            <p class="tooltip-caption">
                <span>{{ genres }}</span>
            </p>
            <p>{{ truncate(movie.plot, 200) }}</p>
        </b-popover>
    </b-col>
</template>

<script>
    import AverageRating from '~/components/default/movie-card/AverageRating';
    import RatingButtons from '~/components/default/movie-card/RatingButtons';

    export default {
        components: {
            AverageRating,
            RatingButtons
        },
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
            },
            showRatingButtons: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        computed: {
            image() {
                const hasImage = this.movie.poster !== null && this.movie.poster !== '' && this.movie.poster !== 'N/A';
                return hasImage ? this.movie.poster : '://via.placeholder.com/160x200';
            },
            averageRating() {
                return parseFloat(this.movie.avgRating).toFixed(1);
            },
            genres() {
                const genresNames = this.movie.genres.map(item => item.name);
                return genresNames.join(' | ');
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
        a
            color: #fff
            p
                margin-bottom: 5px
        .additional-info
            color: #7f828b
    a
        text-decoration: none
    .tooltip-caption
        color: #e4e4e4
        span
            margin-right: 10px

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
