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
                <el-table
                    :data="movies"
                    stripe
                    style="width: 100%"
                    empty-text="No movies found">
                    <el-table-column
                        prop="id"
                        label="#" />
                    <el-table-column
                        prop="title"
                        label="Title" />
                    <el-table-column
                        prop="type"
                        label="Type" />
                    <el-table-column
                        prop="year"
                        label="Year" />
                    <el-table-column
                        label="Release date">
                        <template slot-scope="scope">
                            {{ formatDate(scope.row.releaseDate) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Actions">
                        <template slot-scope="scope">
                            <nuxt-link :to="`/admin/movies/${scope.row.id}`">
                                <el-button
                                    icon="el-icon-search"
                                    circle />
                            </nuxt-link>
                        </template>
                    </el-table-column>
                </el-table>
            </b-col>
        </b-row>
        <paginator
            :count="count"
            :take="take"
            :handle-prev="handlePrev"
            :handle-next="handleNext"
            :handle-change-page="handleChangePage" />
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
        computed: {
            ...mapGetters({
                movies: 'movies/movies',
                count: 'movies/count',
                take: 'movies/take',
                skip: 'movies/skip'
            })
        },
        methods: {
            ...mapActions({
                setSkip: 'movies/setSkip',
            }),
            handlePrev() {
                if ((this.skip - this.take) >= 0) {
                    this.setSkip(this.skip - this.take);
                }
            },
            handleNext() {
                if ((this.skip + this.take) < this.count) {
                    this.setSkip(this.skip + this.take);
                }
            },
            handleChangePage(pageNum) {
                this.setSkip(this.take * (pageNum - 1));
            },
            formatDate(date) {
                return moment(date).format('DD. MM. YYYY');
            }
        },
        async fetch({ store }) {
            await store.dispatch('movies/setGenre', null);
            await store.dispatch('movies/setType', 'all');
            await store.dispatch('movies/setOrderBy', 'id');
            await store.dispatch('movies/setOrder', 'ASC');
            await store.dispatch('movies/setMovies');
            await store.dispatch('movies/setCount');
        }
    };
</script>
