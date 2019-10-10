<template>
    <b-row>
        <b-col>
            <h2>Selected genres</h2>
            <b-row>
                <b-col>
                    <h3>Favourite genres</h3>
                    <ul
                        v-if="favouriteGenres.length"
                        class="genres-grid"
                    >
                        <li
                            v-for="genre in favouriteGenres"
                            :key="genre"
                            title="Click to delete item"
                            @click="deleteGenre(genre, 'favourite')"
                        >
                            {{ genreName(genre) }}
                        </li>
                    </ul>
                    <p v-else>
                        No favourite genres selected.
                    </p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h3>Not favourite genres</h3>
                    <ul
                        v-if="notFavouriteGenres.length"
                        class="genres-grid"
                    >
                        <li
                            v-for="genre in notFavouriteGenres"
                            :key="genre"
                            title="Click to delete item"
                            @click="deleteGenre(genre, 'notFavourite')"
                        >
                            {{ genreName(genre) }}
                        </li>
                    </ul>
                    <p v-else>
                        No not favourite genres selected.
                    </p>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        props: {
            favouriteGenres: {
                type: Array,
                required: true
            },
            notFavouriteGenres: {
                type: Array,
                required: true
            },
            deleteGenreHandler: {
                type: Function,
                required: true
            }
        },
        computed: {
            ...mapGetters({
                allGenres: 'genres/genres'
            }),
            genres() {
                return this.allGenres.filter(item => item.name !== 'N/A');
            }
        },
        methods: {
            genreName(id) {
                const genre = this.genres.find(item => item.id === id);

                return genre ? genre.name : 'None';
            },
            deleteGenre(id, type) {
                this.deleteGenreHandler(id, type);
            }
        }
    };
</script>

<style lang="sass" scoped>
    h2
        margin: 0 0 40px 0
    h3
        margin: 0 0 40px 0
    .genres-grid
        list-style-type: none
        padding: 0
        li
            padding: 10px
            background: #333
            border-bottom: 1px solid #000
            cursor: pointer
</style>
