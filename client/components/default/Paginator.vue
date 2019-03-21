<template>
    <b-row
        id="front-pagination"
        class="text-center"
    >
        <b-col>
            <el-pagination
                :total="count"
                :page-size="take"
                :current-page="currentPage"
                background
                layout="prev, pager, next"
                @prev-click="handlePrev"
                @next-click="handleNext"
                @current-change="handleChangePage"
            >
            </el-pagination>
        </b-col>
    </b-row>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
        computed: {
            ...mapGetters({
                take: 'movies/take',
                skip: 'movies/skip',
                count: 'movies/count',
                currentPage: 'movies/currentPage'
            })
        },
        methods: {
            ...mapActions({
                setSkip: 'movies/setSkip',
                setMovies: 'movies/setMovies',
                setCurrentPage: 'movies/setCurrentPage'
            }),
            handlePrev() {
                if ((this.skip - this.take) >= 0) {
                    this.setCurrentPage(this.currentPage - 1);
                    this.setPage();
                    this.setSkip(this.skip - this.take);
                    this.setMovies();
                }
            },
            handleNext() {
                if ((this.skip + this.take) < this.count) {
                    this.setCurrentPage(this.currentPage + 1);
                    this.setPage();
                    this.setSkip(this.skip + this.take);
                    this.setMovies();
                }
            },
            handleChangePage(pageNum) {
                this.setCurrentPage(pageNum);
                this.setPage();
                this.setSkip(this.take * (pageNum - 1));
                this.setMovies();
            },
            setPage() {
                this.$router.push({ path: this.$route.path, query: { page: this.currentPage } });
            }
        }
    };
</script>

<style lang="sass">
    #front-pagination
        padding: 20px 0
        & .el-pagination > .btn-next, & .el-pagination > .btn-prev, & .el-pagination > .el-pager li
            background-color: #232323 !important
        & .el-pagination.is-background .el-pager li:not(.disabled).active
            background-color: #17a2b8 !important
</style>
