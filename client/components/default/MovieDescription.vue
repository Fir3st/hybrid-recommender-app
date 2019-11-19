<template>
    <b-row>
        <b-col>
            <p class="text-justify">
                {{ movie.plot }}
            </p>
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
    .info
        background-color: #000000
        padding: 10px
    p
        margin-bottom: 15px
</style>
