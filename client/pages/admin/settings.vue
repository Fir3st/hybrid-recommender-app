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
                        id="boosting_favourite"
                        label="Boosting favourite constant"
                        label-for="boosting_favourite"
                    >
                        <b-form-input
                            id="boosting_favourite"
                            v-model="settings.general.boosting_favourite"
                            type="number"
                            step=".01"
                            required
                            placeholder="Enter boosting favourite parameter"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        id="boosting_not_favourite"
                        label="Lowering not favourite constant"
                        label-for="boosting_not_favourite"
                    >
                        <b-form-input
                            id="boosting_not_favourite"
                            v-model="settings.general.boosting_not_favourite"
                            type="number"
                            step=".01"
                            required
                            placeholder="Enter boosting not favourite parameter"
                        ></b-form-input>
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
    import AdminPage from '~/components/admin/AdminPage';

    export default {
        extends: AdminPage,
        async asyncData ({ app }) {
            try {
                const settings = await app.$axios.$get('/settings');

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
                pageTitle: 'Settings',
                breadcrumbs: [
                    { index: 0, name: 'settings' , path: null }
                ],
            };
        },
        methods: {
            async submit() {
                try {
                    await this.$axios.$post('/settings', { settings: this.settings });
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
        }
    };
</script>
