<template>
    <span
        v-if="showRatingButtons && isLogged && !movie.isPenalized"
        class="rating-buttons"
    >
        <el-button
            type="danger"
            icon="el-icon-error"
            size="mini"
            title="Mark this movie as non-relevant for your preferences"
            circle
            @click="negativeRating"
        />
    </span>
</template>

<script>
    export default {
        props: {
            showRatingButtons: {
                type: Boolean,
                required: true
            },
            movie: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                negativeRatingValue: 0.0
            };
        },
        computed: {
            isLogged() {
                return !!this.$auth.user;
            }
        },
        methods: {
            async negativeRating() {
                try {
                    const movieId = this.movie.id;
                    await this.$axios.$post(`/movies/${movieId}/rating`, { rating: this.negativeRatingValue });
                    this.$notify({
                        title: 'Success',
                        message: `Movie ${this.movie.title} has been rated as non-relevant for you.`,
                        type: 'success',
                        position: 'bottom-right'
                    });
                    this.$root.$emit('refreshResults');
                } catch (error) {
                    console.log(error.message);
                    this.$notify({
                        title: 'Error',
                        message: `Something went wrong with rating ${this.movie.title}. Please try it again.`,
                        type: 'error',
                        position: 'bottom-right'
                    });
                }
            }
        }
    };
</script>

<style lang="sass" scoped>
    .rating-buttons
        position: absolute
        right: 5px
        bottom: 5px
        padding: 5px
    .el-button
        margin: 0
    .el-button--mini .is-circle
        padding: 0
</style>
