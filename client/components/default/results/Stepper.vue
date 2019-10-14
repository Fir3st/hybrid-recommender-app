<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <el-steps
                        :active="activeTab"
                        align-center
                    >
                        <el-step
                            title="General settings"
                        />
                        <el-step
                            title="Content-based settings"
                        />
                        <el-step
                            title="Collaborative settings"
                        />
                        <el-step
                            title="Hybrid settings"
                        />
                        <el-step
                            title="Expert system settings"
                        />
                        <el-step
                            title="Results"
                        />
                    </el-steps>
                </b-col>
            </b-row>
            <GeneralSettings
                v-if="activeTab === getIndex('general')"
                :settings="settings.general"
                :change-settings-handler="changeSettingsHandler"
            />
            <CBSettings
                v-if="activeTab === getIndex('cb')"
                :settings="settings.cb"
                :change-settings-handler="changeSettingsHandler"
            />
            <CBFSettings
                v-if="activeTab === getIndex('cbf')"
                :settings="settings.cbf"
                :change-settings-handler="changeSettingsHandler"
                :genres="genres"
            />
            <HybridSettings
                v-if="activeTab === getIndex('hybrid')"
                :settings="settings.hybrid"
                :change-settings-handler="changeSettingsHandler"
                :genres="genres"
            />
            <ExpertSettings
                v-if="activeTab === getIndex('expert')"
                :settings="settings.expert"
                :change-settings-handler="changeSettingsHandler"
                :genres="genres"
            />
            <Results
                v-if="activeTab === settingsLength"
                :settings="settings"
                :movies="movies"
                :favourite-genres="favouriteGenres"
                :not-favourite-genres="notFavouriteGenres"
            />
            <b-row class="btns">
                <b-col class="text-center">
                    <b-button
                        variant="info"
                        :disabled="activeTab === 0"
                        @click="previousTabHandler"
                    >
                        Back
                    </b-button>
                    <b-button
                        variant="info"
                        :disabled="activeTab === settingsLength"
                        @click="nextTabHandler"
                    >
                        Next
                    </b-button>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import CBSettings from './CBSettings';
    import GeneralSettings from './GeneralSettings';
    import CBFSettings from './CBFSettings';
    import HybridSettings from './HybridSettings';
    import ExpertSettings from './ExpertSettings';
    import Results from './ResultsTab';


    export default {
        components: {
            CBSettings,
            GeneralSettings,
            CBFSettings,
            HybridSettings,
            ExpertSettings,
            Results
        },
        props: {
            activeTab: {
                type: Number,
                required: true
            },
            settings: {
                type: Object,
                required: true
            },
            nextTabHandler: {
                type: Function,
                required: true
            },
            previousTabHandler: {
                type: Function,
                required: true
            },
            changeSettingsHandler: {
                type: Function,
                required: true
            },
            genres: {
                type: Array,
                required: true
            },
            movies: {
                type: Array,
                required: true
            },
            favouriteGenres: {
                type: Array,
                required: true
            },
            notFavouriteGenres: {
                type: Array,
                required: true
            }
        },
        computed: {
            settingsLength() {
                return Object.keys(this.settings).length;
            }
        },
        methods: {
            getIndex(type) {
                const keys = Object.keys(this.settings);
                return keys.findIndex(item => item === type);
            }
        }
    };
</script>

<style lang="sass" scoped>
    .btns
        margin-top: 40px
</style>
