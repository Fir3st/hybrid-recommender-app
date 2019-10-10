<template>
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
                {{ round(scope.row.rating, numOfDecPlaces) }}
            </template>
        </el-table-column>
        <el-table-column
            v-if="additionalInfo"
            label="Average rating"
        >
            <template slot-scope="scope">
                {{ round(scope.row.avgRating, 2) }}
            </template>
        </el-table-column>
        <el-table-column
            v-if="additionalInfo"
            label="Number of ratings"
        >
            <template slot-scope="scope">
                {{ round(scope.row.ratingsCount, 0) }}
            </template>
        </el-table-column>
        <el-table-column
            v-if="additionalInfo"
            label="Number of penalizations"
        >
            <template slot-scope="scope">
                {{ round(scope.row.penalized, 0) }}
            </template>
        </el-table-column>
        <el-table-column
            v-if="additionalInfo"
            label="Similarity to already rated items"
        >
            <template slot-scope="scope">
                {{ round(scope.row.ratedSimilarity, numOfDecPlaces) }}
            </template>
        </el-table-column>
        <el-table-column
            v-if="additionalInfo"
            label="ES Score"
        >
            <template slot-scope="scope">
                {{ round(scope.row.esScore, numOfDecPlaces) }}
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
</template>

<script>
    export default {
        props: {
            recommendations: {
                type: Array,
                required: true
            },
            additionalInfo: {
                type: Boolean,
                required: false,
                default: false
            },
            numOfDecPlaces: {
                type: Number,
                default: 4
            }
        },
        methods: {
            round(num, to = 4) {
                return num ? Number.parseFloat(num).toFixed(to) : 0;
            }
        }
    };
</script>
