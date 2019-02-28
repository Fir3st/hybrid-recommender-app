<template>
    <apexchart
        height="400"
        type="bar"
        :options="options"
        :series="series"
    ></apexchart>
</template>

<script>
    import _ from 'lodash';

    export default {
        props: {
            preferences: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                chart: {
                    id: 'preferences'
                },
            };
        },
        computed: {
            sortedPreferences() {
                return _.sortBy(this.preferences, ['avg']).reverse();
            },
            xaxis() {
                return this.sortedPreferences.map(preference => preference.name);
            },
            options() {
                return {
                    chart: this.chart,
                    xaxis: {
                        categories: this.xaxis
                    }
                };
            },
            series() {
                return [
                    /* {
                        name: 'Sum of ratings',
                        data: this.preferences.map(preference => preference.value)
                    },
                    {
                        name: 'Number of rated movies',
                        data: this.preferences.map(preference => preference.count)
                    } */
                    {
                        name: 'Average rating of category',
                        data: this.sortedPreferences.map(preference => preference.avg)
                    }
                ];
            }
        }
    };
</script>
