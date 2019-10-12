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
            <b-row class="btns">
                <b-col class="text-center">
                    <b-button
                        variant="info"
                        @click="previousTabHandler"
                    >
                        Back
                    </b-button>
                    <b-button
                        variant="info"
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

    export default {
        components: {
            CBSettings,
            GeneralSettings,
            CBFSettings,
            HybridSettings
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
