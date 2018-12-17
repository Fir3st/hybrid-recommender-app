import Vue from 'vue';
import { Bar, mixins } from 'vue-chartjs';

export default () => {
    Vue.component('vue-chart', {
        extends: Bar,
        mixins: [ mixins.reactiveProp ],
        props: {
            chartData: {
                type: Object,
                required: false,
                default: () => ({})
            },
            options: {
                type: Object,
                required: false,
                default: () => null
            }
        },
        mounted() {
            this.renderChart(this.chartData, this.options);
        }
    });
};
