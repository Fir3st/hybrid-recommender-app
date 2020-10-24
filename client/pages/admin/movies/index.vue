<template>
    <div class="admin-page">
        <app-breadcrumb :items="breadcrumbs" />
        <b-row>
            <b-col>
                <h1>{{ pageTitle }}</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-button
                    variant="info"
                    class="btn-download"
                    @click="downloadMoviesCSV"
                >
                    Download all movies as CSV
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <el-table
                    :data="movies"
                    stripe
                    style="width: 100%"
                    empty-text="No movies found"
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
                        prop="type"
                        label="Type"
                    />
                    <el-table-column
                        prop="year"
                        label="Year"
                    />
                    <el-table-column
                        label="Release date"
                    >
                        <template slot-scope="scope">
                            {{ formatDate(scope.row.releaseDate) }}
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
        <paginator
            :count="count"
            :take="take"
            :current-page="currentPage"
            :handle-prev="handlePrev"
            :handle-next="handleNext"
            :handle-change-page="handleChangePage"
        />
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapGetters, mapActions } from 'vuex';
    import AdminPage from '~/components/admin/AdminPage';
    import Paginator from '~/components/admin/Paginator';
    export default {
        components: {
            Paginator
        },
        extends: AdminPage,
        data() {
            return {
                pageTitle: 'Movies',
                breadcrumbs: [
                    { index: 0, name: 'movies', path: null }
                ]
            };
        },
        async fetch({ store, query }) {
            await store.dispatch('movies/setPagination', query.page ? parseInt(query.page) : 1);
            await store.dispatch('movies/loadMovies', { genre: null, type: 'all', orderBy: 'id', order: 'ASC' });
        },
        computed: {
            ...mapGetters({
                movies: 'movies/movies',
                count: 'movies/count',
                take: 'movies/take',
                skip: 'movies/skip',
                currentPage: 'movies/currentPage'
            })
        },
        methods: {
            ...mapActions({
                setSkip: 'movies/setSkip',
                setCurrentPage: 'movies/setCurrentPage',
                setMovies: 'movies/setMovies'
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
            formatDate(date) {
                return moment(date).format('DD. MM. YYYY');
            },
            setPage() {
                this.$router.push({ path: this.$route.path, query: { page: this.currentPage } });
            },
            async downloadMoviesCSV() {
                const movies = await this.$axios.$get('/data/movies');
                this.downloadCSV(movies, 'movies.csv');
            }
        }
    };
</script>

<style lang="sass">
    .btn-download
        margin-bottom: 20px
</style>
