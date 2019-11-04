<template>
    <span
        v-if="rating && isLogged"
        class="rating"
    >
        {{ displayedRating }}
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
        },
        computed: {
            displayedRating() {
                let text = '';
                switch (process.env.orderBy) {
                    case 'augmented_rating':
                        text = `Aug. rating: ${this.movie.augmentedRating ? parseFloat(this.movie.augmentedRating).toFixed(6) : 0}`;
                        break;
                    case 'es_score':
                        text = `ES score: ${this.movie.esScore ? parseFloat(this.movie.esScore).toFixed(6) : 0}`;
                        break;
                    default:
                        text = `Pr. rating: ${this.movie.rating ? parseFloat(this.movie.rating).toFixed(6) : 0}`;
                        break;
                }

                return text;
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
