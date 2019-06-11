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
            similarities: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                chart: {
                    id: 'similarities-distribution'
                },
            };
        },
        computed: {
            xaxis() {
                return this.similarities.map(rating => `From ${rating.startValue} to ${rating.endValue}`);
            },
            options() {
                return {
                    chart: this.chart,
                    xaxis: {
                        categories: this.xaxis,
                        labels: {
                            show: false
                        },
                        title: {
                            text: 'Similarity'
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Count'
                        },
                        min: 469000,
                    },
                    dataLabels: {
                        enabled: false
                    }
                };
            },
            series() {
                return [
                    {
                        name: 'Count',
                        data: this.similarities.map(rating => rating.count)
                    }
                ];
            }
        }
    };
</script>
