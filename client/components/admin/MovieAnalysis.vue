<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Movie topics</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <topics-chart
                        :topics="topics" />
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h2>Recommended movies</h2>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import TopicsChart from '~/components/admin/TopicsChart';

    export default {
        components: {
            TopicsChart
        },
        props: {
            topics: {
                type: Array,
                required: true
            },
            recommendations: {
                type: Array,
                required: true
            }
        }
    };
</script>
