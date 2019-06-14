<template>
    <el-table
        :data="data"
        stripe
        style="width: 100%"
    >
        <el-table-column
            prop="value"
            label="Interval (from - to)"
        />
        <el-table-column
            prop="count"
            label="Count"
        />
    </el-table>
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
            data() {
                const results = [];

                for (let i = 0; i < this.distribution.length; i++) {
                    const from = this.distribution[i - 1] ? this.distribution[i - 1].value : 0;
                    const to = this.distribution[i].value;

                    results.push({
                        value: `${from} - ${to}`,
                        count: this.distribution[i].count
                    });
                }

                console.log(results);

                return results;
            }
        }
    };
</script>
