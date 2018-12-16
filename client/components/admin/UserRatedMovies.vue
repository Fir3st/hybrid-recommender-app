<template>
    <b-row>
        <b-col>
            <el-table
                :data="movies"
                stripe
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="#" />
                <el-table-column
                    prop="title"
                    label="Title" />
                <el-table-column
                    prop="rating"
                    label="Rating" />
            </el-table>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            ratings: {
                type: Array,
                required: true
            }
        },
        computed: {
            movies() {
                return this.ratings.map(rating => ({ ...rating.movie, rating: rating.rating }));
            }
        }
    };
</script>
