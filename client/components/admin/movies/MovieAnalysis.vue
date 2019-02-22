<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Number of ratings</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <p>Movie was rated {{ ratings.length }} times</p>
                </b-col>
            </b-row>
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
            <b-row>
                <b-col>
                    <el-table
                        :data="recommendations"
                        stripe
                        style="width: 100%">
                        <el-table-column
                            prop="id"
                            label="#" />
                        <el-table-column
                            prop="title"
                            label="Title" />
                        <el-table-column
                            prop="similarity"
                            label="Similarity" />
                        <el-table-column
                            label="Actions">
                            <template slot-scope="scope">
                                <nuxt-link :to="`/admin/movies/${scope.row.id}`">
                                    <el-button
                                        icon="el-icon-search"
                                        circle />
                                </nuxt-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import TopicsChart from '~/components/admin/movies/TopicsChart';

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
            },
            ratings: {
                type: Array,
                required: true
            }
        }
    };
</script>
