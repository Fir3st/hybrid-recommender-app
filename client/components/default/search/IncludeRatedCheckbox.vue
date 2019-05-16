<template>
    <b-row class="include-rated">
        <b-col>
            <el-checkbox
                :value="includeRated"
                @change="onChange"
            >
                Include already rated movies to search results
            </el-checkbox>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            onChange: {
                type: Function,
                required: true
            },
            includeRated: {
                type: Boolean,
                required: true
            }
        }
    };
</script>

<style lang="sass" scoped>
    .include-rated
        color: #ccc
</style>
