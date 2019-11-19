<template>
    <b-row class="movie-info">
        <b-col>
            <div class="info">
                <p><strong>Type:</strong> {{ movie.type }}</p>
                <p><strong>Director(s):</strong> {{ movie.director }}</p>
                <p><strong>Actor(s):</strong> {{ actors }}</p>
                <p><strong>Country of origin:</strong> {{ countries }}</p>
                <p><strong>Language(s):</strong> {{ languages }}</p>
                <p><strong>Production:</strong> {{ movie.production }}</p>
            </div>
        </b-col>
    </b-row>
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
            actors() {
                const actors = this.movie.actors.map(actor => actor.name);
                return actors.join(', ');
            },
            countries() {
                const countries = this.movie.countries.map(country => country.name);
                return countries.join(', ');
            },
            languages() {
                const languages = this.movie.languages.map(language => language.name);
                return languages.join(', ');
            }
        }
    };
</script>

<style lang="sass" scoped>
    .movie-info
        margin-bottom: 20px
    .info
        background-color: #000000
        padding: 10px
    p
        margin-bottom: 15px
</style>
