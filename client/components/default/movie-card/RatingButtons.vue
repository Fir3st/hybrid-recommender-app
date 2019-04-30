<template>
    <span
        v-if="showRatingButtons && isLogged"
        class="rating-buttons"
    >
        <i class="el-icon-error rating-button"></i>
        <i class="el-icon-success rating-button"></i>
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
        computed: {
            isLogged() {
                return !!this.$auth.user;
            }
        }
    };
</script>

<style lang="sass" scoped>
    .rating-buttons
        position: absolute
        right: 5px
        bottom: 5px
        background: #000
        color: #fff
        padding: 5px
        font-size: 13px

        .rating-button:hover
            color: #17a2b8
            cursor: Pointer
</style>
