<template>
    <b-row
        id="admin-pagination"
        class="text-center">
        <b-col>
            <el-pagination
                :total="count"
                :page-size="take"
                background
                layout="prev, pager, next"
                @prev-click="handlePrev"
                @next-click="handleNext"
                @current-change="handleChangePage">
            </el-pagination>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            count: {
                type: Number,
                required: true
            },
            take: {
                type: Number,
                required: true
            },
            handlePrev: {
                type: Function,
                required: true
            },
            handleNext: {
                type: Function,
                required: true
            },
            handleChangePage: {
                type: Function,
                required: true
            }
        }
    };
</script>

<style lang="sass">
    #admin-pagination
        padding: 20px 0
</style>
