<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col sm="2">
                    ID:
                </b-col>
                <b-col sm="10">
                    {{ movie.id }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    IMDb id:
                </b-col>
                <b-col sm="10">
                    {{ movie.imdbId }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Title:
                </b-col>
                <b-col sm="10">
                    {{ movie.title }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Type:
                </b-col>
                <b-col sm="10">
                    {{ movie.type }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Year:
                </b-col>
                <b-col sm="10">
                    {{ movie.year }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Release date:
                </b-col>
                <b-col sm="10">
                    {{ formatDate(movie.releaseDate) }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    MPAA rating:
                </b-col>
                <b-col sm="10">
                    {{ movie.rating }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Director:
                </b-col>
                <b-col sm="10">
                    {{ movie.director }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Production:
                </b-col>
                <b-col sm="10">
                    {{ movie.production }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Plot:
                </b-col>
                <b-col sm="10">
                    {{ movie.plot }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Director:
                </b-col>
                <b-col sm="10">
                    {{ movie.director }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Languages:
                </b-col>
                <b-col sm="10">
                    {{ languages }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Actors:
                </b-col>
                <b-col sm="10">
                    {{ actors }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Countries:
                </b-col>
                <b-col sm="10">
                    {{ countries }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Genres:
                </b-col>
                <b-col sm="10">
                    {{ genres }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Ratings:
                </b-col>
                <b-col sm="10">
                    <ul>
                        <li
                            v-for="rating in movie.ratings"
                            :key="rating.id"
                        >
                            {{ rating.source }}: {{ rating.value }}
                        </li>
                    </ul>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Poster:
                </b-col>
                <b-col sm="10">
                    <b-img
                        :src="movie.poster"
                        :alt="movie.title"
                    ></b-img>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import moment from 'moment';

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
            },
            genres() {
                const genresNames = this.movie.genres.map(item => item.name);
                return genresNames.join(', ');
            }
        },
        methods: {
            formatDate(date) {
                return moment(date).format('DD. MM. YYYY');
            }
        }
    };
</script>
