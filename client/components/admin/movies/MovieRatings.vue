<template>
    <el-table
        :data="ratings"
        stripe
        style="width: 100%">
        <el-table-column
            prop="user.name"
            label="User name" />
        <el-table-column
            prop="user.surname"
            label="User surname" />
        <el-table-column
            prop="rating"
            label="Rating" />
    </el-table>
</template>

<script>
    export default {
        props: {
            ratings: {
                type: Array,
                required: true
            }
        }
    };
</script>
