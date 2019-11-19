<template>
    <div class="additional-info">
        <b-row>
            <b-col>
                <p>
                    {{ movie.year }} <span class="separator">|</span>
                    {{ genres }} <span class="separator">|</span>
                    {{ movie.rating }}
                </p>
            </b-col>
        </b-row>
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
            genres() {
                const genresNames = this.movie.genres.map(item => item.name);
                return genresNames.join(', ');
            }
        }
    };
</script>

<style lang="sass" scoped>
    .additional-info
        color: #aeb2bd
    .separator
        padding: 10px
</style>
