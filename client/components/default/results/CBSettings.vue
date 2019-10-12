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
            }
        },
        methods: {
            changeRecType(value) {
                this.changeSettingsHandler('cb', 'recType', value);
            },
            changeOrderBy(value) {
                this.changeSettingsHandler('cb', 'orderBy', value);
            }
        }
    };
</script>
