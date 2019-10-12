<template>
    <b-row>
        <b-col>
            <b-form>
                <b-form-group
                    id="algorithm"
                    label="Algorithm"
                    label-for="algorithm"
                >
                    <b-form-select
                        id="algorithm"
                        :value="settings.recType"
                        :options="settings.recTypes"
                        @change="changeRecType"
                    ></b-form-select>
                </b-form-group>
                <b-form-group
                    id="similarityType"
                    label="Similarity function"
                    label-for="similarityType"
                >
                    <b-form-select
                        id="similarityType"
                        :value="settings.similarityType"
                        :options="settings.similarityTypes"
                        :disabled="settings.recType === 'svd'"
                        @change="changeSimilarityType"
                    ></b-form-select>
                </b-form-group>
                <b-form-group
                    id="similaritySource"
                    label="Algorithm used for similarity with already rated movies"
                    label-for="similaritySource"
                >
                    <b-form-select
                        id="similaritySource"
                        :value="settings.similaritySource"
                        :options="settings.similaritySources"
                        @change="changeSimilaritySource"
                    ></b-form-select>
                </b-form-group>
                <b-form-group
                    id="genre"
                    label="Specific genres (optional)"
                    label-for="genre"
                >
                    <b-form-select
                        id="genre"
                        :value="settings.genre"
                        :options="genres"
                        :select-size="4"
                        multiple
                        @change="changeGenre"
                    ></b-form-select>
                </b-form-group>
                <b-form-group
                    id="movieType"
                    label="Specific movie type (optional)"
                    label-for="movieType"
                >
                    <b-form-select
                        id="movieType"
                        :value="settings.movieType"
                        :options="settings.movieTypes"
                        @change="changeMovieType"
                    ></b-form-select>
                </b-form-group>
                <b-form-group
                    id="orderBy"
                    label="Order by"
                    label-for="orderBy"
                >
                    <b-form-select
                        id="orderBy"
                        :value="settings.orderBy"
                        :options="settings.orderByOptions"
                        @change="changeOrderBy"
                    ></b-form-select>
                </b-form-group>
            </b-form>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            settings: {
                type: Object,
                required: true
            },
            changeSettingsHandler: {
                type: Function,
                required: true
            },
            genres: {
                type: Array,
                required: true
            }
        },
        methods: {
            changeRecType(value) {
                this.changeSettingsHandler('expert', 'recType', value);
                if (this.settings.recType === 'svd') {
                    this.changeSettingsHandler('expert', 'similarityType', null);
                }
            },
            changeSimilarityType(value) {
                this.changeSettingsHandler('expert', 'similarityType', value);
            },
            changeSimilaritySource(value) {
                this.changeSettingsHandler('expert', 'similaritySource', value);
            },
            changeGenre(value) {
                this.changeSettingsHandler('expert', 'genre', value);
            },
            changeMovieType(value) {
                this.changeSettingsHandler('expert', 'movieType', value);
            },
            changeOrderBy(value) {
                this.changeSettingsHandler('expert', 'orderBy', value);
            }
        }
    };
</script>
