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
                return _.sortBy(this.preferences, ['count']).reverse();
            },
            xaxis() {
                return this.sortedPreferences.map(preference => `${preference.name} (${preference.count} ratings)`);
            },
            options() {
                return {
                    chart: this.chart,
                    xaxis: {
                        categories: this.xaxis
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: (val, opt) => {
                                return  `${val} (${this.sortedPreferences[opt.dataPointIndex].count} ratings)`;
                            }
                        }
                    }
                };
            },
            series() {
                return [
                    {
                        name: 'Average rating of category',
                        data: this.sortedPreferences.map(preference => preference.avg)
                    }
                ];
            }
        }
    };
</script>
