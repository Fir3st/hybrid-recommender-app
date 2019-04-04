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
            label="Predicted rating (normalized)"
        >
            <template slot-scope="scope">
                {{ scope.row.rating ? Number.parseFloat(scope.row.rating).toFixed(2) : '' }}
            </template>
        </el-table-column>
        <el-table-column
            v-if="additionalInfo"
            label="Average rating"
        >
            <template slot-scope="scope">
                {{ scope.row.avgRating ? Number.parseFloat(scope.row.avgRating).toFixed(2) : '' }}
            </template>
        </el-table-column>
        <el-table-column
            v-if="additionalInfo"
            label="Number of ratings"
        >
            <template slot-scope="scope">
                {{ scope.row.ratingsCount ? Number.parseInt(scope.row.ratingsCount) : '' }}
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
            }
        }
    };
</script>
