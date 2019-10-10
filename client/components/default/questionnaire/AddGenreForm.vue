<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Add new genre</h2>
                </b-col>
            </b-row>
            <b-row v-if="favouriteGenres.length >= numOfGenres && notFavouriteGenres.length >= numOfGenres">
                <b-col>
                    <p>You already have enough selected genres.</p>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col>
                    <b-form-select
                        v-model="selectedItem"
                        :options="options"
                    />
                </b-col>
            </b-row>
            <b-row
                v-if="selectedItem"
                class="add-buttons"
            >
                <b-col>
                    <p><strong>Selected genre:</strong> {{ genreName(selectedItem) }}</p>
                    <b-button
                        variant="info"
                        @click="addFavouriteGenre"
                    >
                        Mark as favourite
                    </b-button>
                    <b-button
                        variant="info"
                        @click="addNotFavouriteGenre"
                    >
                        Mark as not favourite
                    </b-button>
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
            addGenreHandler: {
                type: Function,
                required: true
            },
            numOfGenres: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                selectedItem: null,

            };
        },
        computed: {
            ...mapGetters({
                allGenres: 'genres/genres'
            }),
            genres() {
                return this.allGenres.filter(item => item.name !== 'N/A').map((item) => {
                    return { value: item.id, text: item.name };
                });
            },
            options() {
                return [
                    { value: null, text: 'Please selected desired genre' },
                    ...this.genres
                ];
            }
        },
        methods: {
            genreName(id) {
                const genre = this.genres.find(item => item.value === id);

                return genre ? genre.text : 'None';
            },
            addFavouriteGenre() {
                this.addGenreHandler(this.selectedItem, 'favourite');
                this.selectedItem = null;
            },
            addNotFavouriteGenre() {
                this.addGenreHandler(this.selectedItem, 'notFavourite');
                this.selectedItem = null;
            }
        }
    };
</script>

<style lang="sass" scoped>
    h2
        margin: 40px 0 40px 0
    p
        margin: 0 0 40px 0
    select
        margin-bottom: 20px
    .add-buttons
        margin-bottom: 20px
</style>

