<template>
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
                    prop="similarity"
                    label="Similarity"
                />
                <el-table-column
                    prop="esScore"
                    label="Expert system score"
                />
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
</template>

<script>
    export default {
        props: {
            recommendations: {
                type: Array,
                required: true
            },
        }
    };
</script>
