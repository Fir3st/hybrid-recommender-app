<template>
    <div class="admin-page">
        <app-breadcrumb :items="breadcrumbs" />
        <b-row>
            <b-col>
                <h1>{{ pageTitle }}</h1>
            </b-col>
        </b-row>
        <b-row v-if="settings">
            <b-col>
                <b-form
                    @submit.prevent="submit"
                >
                    <h2>General settings</h2>
                    <b-form-group
                        id="take"
                        label="Take"
                        label-for="take"
                    >
                        <b-form-input
                            id="take"
                            v-model="settings.general.take"
                            type="number"
                            required
                            placeholder="Enter take parameter"
                        ></b-form-input>
                    </b-form-group>

                    <h2>Content-based settings</h2>
                    <b-form-group
                        label="Algorithm"
                        label-for="cb-algorithm"
                    >
                        <b-form-select
                            id="cb-algorithm"
                            v-model="settings.cb.recType"
                            :options="options.cb.recTypes"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Order by"
                        label-for="cb-orderBy"
                    >
                        <b-form-select
                            id="cb-orderBy"
                            v-model="settings.cb.orderBy"
                            :options="options.cb.orderByOptions"
                        ></b-form-select>
                    </b-form-group>

                    <h2>Collaborative settings</h2>
                    <b-form-group
                        label="Algorithm"
                        label-for="cbf-algorithm"
                    >
                        <b-form-select
                            id="cbf-algorithm"
                            v-model="settings.cbf.recType"
                            :options="options.cbf.recTypes"
                            @change="changeRecType('cbf')"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Similarity function"
                        label-for="cbf-similarityType"
                    >
                        <b-form-select
                            id="cbf-similarityType"
                            v-model="settings.cbf.similarityType"
                            :options="options.cbf.similarityTypes"
                            :disabled="settings.cbf.recType === 'svd'"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Algorithm used for similarity with already rated movies"
                        label-for="cbf-similaritySource"
                    >
                        <b-form-select
                            id="cbf-similaritySource"
                            v-model="settings.cbf.similaritySource"
                            :options="options.cbf.similaritySources"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Specific genres"
                        label-for="cbf-genre"
                    >
                        <b-form-select
                            id="cbf-genre"
                            v-model="settings.cbf.genre"
                            :options="genres"
                            :select-size="4"
                            multiple
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Specific movie type"
                        label-for="cbf-movieType"
                    >
                        <b-form-select
                            id="cbf-movieType"
                            v-model="settings.cbf.movieType"
                            :options="options.cbf.movieTypes"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Order by"
                        label-for="cbf-orderBy"
                    >
                        <b-form-select
                            id="cbf-orderBy"
                            v-model="settings.cbf.orderBy"
                            :options="options.cbf.orderByOptions"
                        ></b-form-select>
                    </b-form-group>

                    <h2>Hybrid settings</h2>
                    <b-form-group
                        label="Hybrid type"
                        label-for="hybrid-hybridType"
                    >
                        <b-form-select
                            id="hybrid-hybridType"
                            v-model="settings.hybrid.hybridType"
                            :options="options.hybrid.hybridTypes"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Collaborative algorithm"
                        label-for="hybrid-algorithm"
                    >
                        <b-form-select
                            id="hybrid-algorithm"
                            v-model="settings.hybrid.recType"
                            :options="options.hybrid.recTypes"
                            @change="changeRecType('hybrid')"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Similarity function"
                        label-for="hybrid-similarityType"
                    >
                        <b-form-select
                            id="hybrid-similarityType"
                            v-model="settings.hybrid.similarityType"
                            :options="options.hybrid.similarityTypes"
                            :disabled="settings.hybrid.recType === 'svd'"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Content-based algorithm"
                        label-for="hybrid-similaritySource"
                    >
                        <b-form-select
                            id="hybrid-similaritySource"
                            v-model="settings.hybrid.similaritySource"
                            :options="options.hybrid.similaritySources"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Specific genres"
                        label-for="hybrid-genre"
                    >
                        <b-form-select
                            id="hybrid-genre"
                            v-model="settings.hybrid.genre"
                            :options="genres"
                            :select-size="4"
                            multiple
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Specific movie type"
                        label-for="hybrid-movieType"
                    >
                        <b-form-select
                            id="hybrid-movieType"
                            v-model="settings.hybrid.movieType"
                            :options="options.hybrid.movieTypes"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Order by"
                        label-for="hybrid-orderBy"
                    >
                        <b-form-select
                            id="hybrid-orderBy"
                            v-model="settings.hybrid.orderBy"
                            :options="options.hybrid.orderByOptions"
                        ></b-form-select>
                    </b-form-group>

                    <h2>Expert system settings</h2>
                    <b-form-group
                        label="Algorithm"
                        label-for="expert-algorithm"
                    >
                        <b-form-select
                            id="expert-algorithm"
                            v-model="settings.expert.recType"
                            :options="options.expert.recTypes"
                            @change="changeRecType('expert')"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Similarity function"
                        label-for="expert-similarityType"
                    >
                        <b-form-select
                            id="expert-similarityType"
                            v-model="settings.expert.similarityType"
                            :options="options.expert.similarityTypes"
                            :disabled="settings.expert.recType === 'svd'"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Algorithm used for similarity with already rated movies"
                        label-for="expert-similaritySource"
                    >
                        <b-form-select
                            id="expert-similaritySource"
                            v-model="settings.expert.similaritySource"
                            :options="options.expert.similaritySources"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Specific genres"
                        label-for="expert-genre"
                    >
                        <b-form-select
                            id="expert-genre"
                            v-model="settings.expert.genre"
                            :options="genres"
                            :select-size="4"
                            multiple
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Specific movie type"
                        label-for="expert-movieType"
                    >
                        <b-form-select
                            id="expert-movieType"
                            v-model="settings.expert.movieType"
                            :options="options.expert.movieTypes"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        label="Order by"
                        label-for="expert-orderBy"
                    >
                        <b-form-select
                            id="expert-orderBy"
                            v-model="settings.expert.orderBy"
                            :options="options.expert.orderByOptions"
                        ></b-form-select>
                    </b-form-group>

                    <b-button
                        type="submit"
                        variant="info"
                    >
                        Submit
                    </b-button>
                </b-form>
            </b-col>
        </b-row>
        <b-row v-else>
            <b-col>
                <p>No settings found.</p>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { cbRecTypes, cbfRecTypes, similarityTypes, movieTypes, hybridTypes } from '~/utils/constants';
    import AdminPage from '~/components/admin/AdminPage';

    export default {
        extends: AdminPage,
        async asyncData ({ app }) {
            try {
                const settings = await app.$axios.$get('/results/settings');

                if (settings) {
                    return {
                        settings
                    };
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        data() {
            return {
                pageTitle: 'Results form settings',
                breadcrumbs: [
                    { index: 0, name: 'results', path: '/admin/results' },
                    { index: 1, name: 'settings' , path: null }
                ],
                options: {
                    cb: {
                        recTypes: [
                            { value: null, text: 'Please select an algorithm' },
                            ...cbRecTypes
                        ],
                        orderByOptions: [
                            { value: null, text: 'Please select columns for sorting and their order' },
                            { value: 'similarity', text: 'Only Similarity' },
                            { value: 'es_score', text: 'Only Expert system score' },
                            { value: 'similarity,es_score', text: 'Similarity, Expert system score (default)' },
                            { value: 'es_score,similarity', text: 'Expert system score, Similarity' },
                        ]
                    },
                    cbf: {
                        recTypes: [
                            { value: null, text: 'Please select an algorithm' },
                            ...cbfRecTypes
                        ],
                        similarityTypes: [
                            { value: null, text: 'Please select a similarity function' },
                            ...similarityTypes
                        ],
                        similaritySources: [
                            { value: null, text: 'Please select an algorithm' },
                            ...cbRecTypes
                        ],
                        movieTypes:  [
                            { value: null, text: 'Please select a movie type' },
                            ...movieTypes
                        ],
                        orderByOptions: [
                            { value: null, text: 'Please select columns for sorting and their order' },
                            { value: 'rating', text: 'Only predicted rating' },
                            { value: 'es_score', text: 'Only Expert system score' },
                            { value: 'rating,es_score', text: 'Predicted rating, Expert system score (default)' },
                            { value: 'es_score,rating', text: 'Expert system score, Predicted rating' },
                        ]
                    },
                    hybrid: {
                        hybridTypes: [
                            { value: null, text: 'Please select a hybrid hype' },
                            ...hybridTypes
                        ],
                        recTypes: [
                            { value: null, text: 'Please select a collaborative algorithm' },
                            ...cbfRecTypes
                        ],
                        similarityTypes: [
                            { value: null, text: 'Please select a similarity function for collaborative filtering' },
                            ...similarityTypes
                        ],
                        similaritySources: [
                            { value: null, text: 'Please select a content-based algorithm' },
                            ...cbRecTypes
                        ],
                        movieTypes:  [
                            { value: null, text: 'Please select a movie type' },
                            ...movieTypes
                        ],
                        orderByOptions: [
                            { value: null, text: 'Please select columns for sorting and their order' },
                            { value: 'similarity,rating', text: 'Only predicted rating/similarity' },
                            { value: 'es_score', text: 'Only Expert system score' },
                            { value: 'similarity,rating,es_score', text: 'Predicted rating/Similarity, Expert system score (default)' },
                            { value: 'es_score,similarity,rating', text: 'Expert system score, Predicted rating/Similarity' },
                        ]
                    },
                    expert: {
                        recTypes: [
                            { value: null, text: 'Please select an algorithm' },
                            ...cbfRecTypes
                        ],
                        similarityTypes: [
                            { value: null, text: 'Please select a similarity function' },
                            ...similarityTypes
                        ],
                        similaritySources: [
                            { value: null, text: 'Please select an algorithm' },
                            ...cbRecTypes
                        ],
                        movieTypes:  [
                            { value: null, text: 'Please select a movie type' },
                            ...movieTypes
                        ],
                        orderByOptions: [
                            { value: null, text: 'Please select columns for sorting and their order' },
                            { value: 'es_score', text: 'Only Expert system score' },
                            { value: 'es_score,rating', text: 'Expert system score, Predicted rating' },
                            { value: 'rating,es_score', text: 'Predicted rating, Expert system score' },
                            { value: 'augmented_rating', text: 'Augmented rating by Expert system score' }
                        ]
                    }
                }
            };
        },
        computed: {
            ...mapGetters({
                allGenres: 'genres/genres'
            }),
            genres() {
                const genres = this.allGenres.filter(item => item.name !== 'N/A');
                const options = genres.map((item) => {
                    return { value: item.id, text: item.name };
                });

                return [
                    ...options
                ];
            }
        },
        methods: {
            async submit() {
                try {
                    await this.$axios.$post('/results/settings', { settings: this.settings });
                    this.$notify({
                        title: 'Success',
                        message: `Settings successfully changed.`,
                        type: 'success',
                        position: 'bottom-right'
                    });
                } catch (error) {
                    console.log(error.message);
                    this.$notify({
                        title: 'Success',
                        message: `Something went wrong.`,
                        type: 'success',
                        position: 'bottom-right'
                    });
                }
            },
            changeRecType(type) {
                if (this.settings[type].recType === 'svd') {
                    this.settings[type].similarityType = null;
                }
            },
        }
    };
</script>
