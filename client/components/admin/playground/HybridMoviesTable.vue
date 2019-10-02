<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <p>
                        Similarity is different for different types of recommendation. For Collaborative recommendations it represents similarity to already rated movies, for content-based recommendations it represents similarity to viewed movie.
                    </p>
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
                            label="Predicted rating"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.rating > 0 ? round(scope.row.rating, 2) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="Average rating"
                        >
                            <template slot-scope="scope">
                                {{ round(scope.row.avgRating, 2) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="Number of ratings"
                        >
                            <template slot-scope="scope">
                                {{ round(scope.row.ratingsCount, 0) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="Number of penalizations"
                        >
                            <template slot-scope="scope">
                                {{ round(scope.row.penalized, 0) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="Similarity"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.ratedSimilarity ? round(scope.row.ratedSimilarity) : round(scope.row.similarity) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="ES Score"
                        >
                            <template slot-scope="scope">
                                {{ round(scope.row.esScore) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="Type of rec"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.recType === 1 ? 'Collaborative' : 'Content-based' }}
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
            recommendations: {
                type: Array,
                required: true
            },
        },
        methods: {
            round(num, to = 4) {
                return num ? Number.parseFloat(num).toFixed(to) : 0;
            }
        }
    };
</script>

<style lang="sass" scoped>
    p
        margin: 20px 0
</style>
