<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Number of rated movies</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <p>User rated {{ ratings.length }} movies</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h2>Recommended movies (user-based)</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <el-table
                        :data="recommendations"
                        stripe
                        style="width: 100%"
                    >
                        <el-table-column
                            prop="id"
                            label="#"
                        />
                        <el-table-column
                            prop="title"
                            label="Title"
                        />
                        <el-table-column
                            label="Predicted rating (normalized)"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.rating ? Number.parseFloat(scope.row.rating).toFixed(2) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="Actions"
                        >
                            <template slot-scope="scope">
                                <nuxt-link :to="`/admin/movies/${scope.row.id}`">
                                    <el-button
                                        icon="el-icon-search"
                                        circle
                                    />
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
    export default {
        props: {
            ratings: {
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
