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
                            title="Content-based options"
                        />
                        <el-step
                            title="Collaborative options"
                        />
                        <el-step
                            title="Hybrid options"
                        />
                        <el-step
                            title="Expert system options"
                        />
                    </el-steps>
                </b-col>
            </b-row>
            <CBSettings
                v-if="activeTab === 0"
                :settings="settings.cb"
                :change-settings-handler="changeSettingsHandler"
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
    import CBSettings from "./CBSettings";

    export default {
        components: {
            CBSettings
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
            }
        }
    };
</script>

<style lang="sass" scoped>
    .btns
        margin-top: 40px
</style>
