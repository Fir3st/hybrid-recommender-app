import Vue from 'vue';
import { Pie, mixins } from 'vue-chartjs';

export default () => {
    Vue.component('my-pie', {
        extends: Pie,
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
