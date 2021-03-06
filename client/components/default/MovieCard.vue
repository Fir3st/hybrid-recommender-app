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
            <similarity
                :movie="movie"
                :similarity="similarity"
            />
            <rating
                :movie="movie"
                :rating="rating"
            />
            <nuxt-link
                :id="`card-${movie.id}`"
                :to="`/detail/${movie.id}`"
            >
                <b-img
                    :src="image"
                    :alt="movie.title"
                    :class="{ penalized: movie.isPenalized }"
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
            <div v-if="isAdmin && analytics">
                <p><strong>Analytics</strong></p>
                <p><strong>Predicated rating for curr. user: </strong> {{ movie.rating }}</p>
                <p><strong>Predicated augmented rating: </strong> {{ movie.augmentedRating || 0 }}</p>
                <p><strong>Average rating: </strong> {{ movie.avgRating }}</p>
                <p><strong>Number of ratings: </strong> {{ movie.ratingsCount }}</p>
                <p><strong>Number of penalizations: </strong> {{ movie.penalized }}</p>
                <p><strong>Sim. to already rated items: </strong> {{ movie.ratedSimilarity || '-' }}</p>
                <p><strong>Expert system score: </strong> {{ movie.esScore || 0 }}</p>
            </div>
        </b-popover>
    </b-col>
</template>

<script>
    import AverageRating from '~/components/default/movie-card/AverageRating';
    import RatingButtons from '~/components/default/movie-card/RatingButtons';
    import Similarity from '~/components/default/movie-card/Similarity';
    import Rating from '~/components/default/movie-card/Rating';

    export default {
        components: {
            AverageRating,
            RatingButtons,
            Similarity,
            Rating
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
            },
            similarity: {
                type: Boolean,
                required: false,
                default: false
            },
            rating: {
                type: Boolean,
                required: false,
                default: false
            },
            analytics: {
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
    .penalized
        -webkit-filter: grayscale(100%)
        filter: grayscale(100%)

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
