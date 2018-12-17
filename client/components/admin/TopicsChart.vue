<template>
    <div>
        <my-pie
            v-if="show"
            :chart-data="chartData"
            :styles="style"
            :options="options" />
    </div>
</template>

<script>
    import palette from 'google-palette';

    export default {
        props: {
            topics: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                show: false,
                options: {
                    maintainAspectRatio: false,
                    responsive: true
                },
                style: {
                    height: '300px'
                }
            };
        },
        computed: {
            chartData() {
                const labels = [];
                const colors = palette('tol-sq', this.topics.length);
                for (let i = 0; i < this.topics.length; i += 1) {
                    labels.push(`Topic ${i}`);
                }
                return {
                    labels,
                    datasets: [
                        {
                            backgroundColor: colors.map(item => `#${item}`),
                            data: this.topics.map(item => item * 100)
                        }
                    ]
                };
            }
        },
        mounted() {
            this.show = true;
        }
    };
</script>
