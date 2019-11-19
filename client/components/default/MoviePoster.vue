<template>
    <div class="crop">
        <b-img
            :src="image"
            :alt="movie.title"
            fluid
        />
    </div>
</template>

<script>
    export default {
        props: {
            movie: {
                type: Object,
                required: true
            }
        },
        computed: {
            image() {
                const hasImage = this.movie.poster !== null && this.movie.poster !== '' && this.movie.poster !== 'N/A';
                return hasImage ? this.movie.poster : '://via.placeholder.com/160x200';
            }
        }
    };
</script>

<style lang="sass" scoped>
    .crop
        height: 350px
        position: relative
        overflow: hidden
        margin-bottom: 10px
        border: 1px solid #7f828b
    @media (max-width: 1199px)
        .crop
            height: 300px
    @media (max-width: 768px)
        .crop
            height: 275px
    @media (max-width: 576px)
        .crop
            height: 350px
        .img-fluid
            width: 100% !important
</style>
