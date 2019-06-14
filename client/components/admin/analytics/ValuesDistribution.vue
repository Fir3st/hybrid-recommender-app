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
            distribution: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                chart: {
                    id: 'distribution'
                },
            };
        },
        computed: {
            sorted() {
                return _.sortBy(this.distribution, ['rating']);
            },
            xaxis() {
                return this.sorted.map(rating => rating.rating.toString());
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
                    {
                        name: 'Ratings count',
                        data: this.sorted.map(rating => rating.count)
                    }
                ];
            }
        }
    };
</script>
