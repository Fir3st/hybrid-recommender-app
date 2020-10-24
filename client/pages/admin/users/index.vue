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
                    @click="downloadUsersCSV"
                >
                    Export users and genres as CSV
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <el-table
                    :data="users"
                    stripe
                    style="width: 100%"
                    empty-text="No users found"
                >
                    <el-table-column
                        prop="id"
                        label="#"
                    />
                    <el-table-column
                        prop="name"
                        label="Name"
                    />
                    <el-table-column
                        prop="surname"
                        label="Last name"
                    />
                    <el-table-column
                        prop="email"
                        label="E-mail"
                    />
                    <el-table-column
                        label="Role"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.admin">Admin</span>
                            <span v-else>User</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Number of ratings"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.ratings.length }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Actions"
                    >
                        <template slot-scope="scope">
                            <nuxt-link :to="`/admin/users/${scope.row.id}`">
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
    import { mapGetters, mapActions } from 'vuex';
    import AdminPage from '~/components/admin/AdminPage';
    import Paginator from '~/components/admin/Paginator';
    import * as _ from "lodash";

    export default {
        components: {
            Paginator
        },
        extends: AdminPage,
        data() {
            return {
                pageTitle: 'Users',
                breadcrumbs: [
                    { index: 0, name: 'users', path: null }
                ]
            };
        },
        async fetch({ store, query }) {
            await store.dispatch('users/setPagination', query.page ? parseInt(query.page) : 1);
            await store.dispatch('users/setUsers');
            await store.dispatch('users/setCount');
        },
        computed: {
            ...mapGetters({
                users: 'users/users',
                count: 'users/count',
                take: 'users/take',
                skip: 'users/skip',
                currentPage: 'users/currentPage'
            })
        },
        methods: {
            ...mapActions({
                setSkip: 'users/setSkip',
                setCurrentPage: 'users/setCurrentPage',
                setUsers: 'users/setUsers'
            }),
            handlePrev() {
                if ((this.skip - this.take) >= 0) {
                    this.setCurrentPage(this.currentPage - 1);
                    this.setPage();
                    this.setSkip(this.skip - this.take);
                    this.setUsers();
                }
            },
            handleNext() {
                if ((this.skip + this.take) < this.count) {
                    this.setCurrentPage(this.currentPage + 1);
                    this.setPage();
                    this.setSkip(this.skip + this.take);
                    this.setUsers();
                }
            },
            handleChangePage(pageNum) {
                this.setCurrentPage(pageNum);
                this.setPage();
                this.setSkip(this.take * (pageNum - 1));
                this.setUsers();
            },
            setPage() {
                this.$router.push({ path: this.$route.path, query: { page: this.currentPage } });
            },
            getFormattedGenres(name, data) {
                const genres = {};
                let index = 1;

                for (const genre of data) {
                    genres[`${name} - name ${index}`] = genre.name;
                    genres[`${name} - count ${index}`] = genre.count;
                    genres[`${name} - avg ${index}`] = genre.avg;
                    index += 1;
                }

                return genres;
            },
            getMostRatedGenres(name, data, num = 3) {
                const ratedGenres = data.filter((genre) => genre.count);

                if (ratedGenres && ratedGenres.length > 0) {
                    return this.getFormattedGenres(name, _.orderBy(data, ['count'], ['desc']).slice(0, num));
                }

                return {};
            },
            getMostValuedGenres(name, data, num = 3) {
                const ratedGenres = data.filter((genre) => genre.count);

                if (ratedGenres && ratedGenres.length > 0) {
                    return this.getFormattedGenres(name, _.orderBy(data, ['value'], ['desc']).slice(0, num));
                }

                return {};
            },
            getLeastRatedGenres(name, data, num = 3) {
                const notRatedGenres = data.filter((genre) => genre.count === 0);

                if (notRatedGenres && notRatedGenres.length < num) {
                    let genres = data.filter((genre) => genre.count);
                    genres = [
                        ..._.orderBy(genres, ['count'], ['desc']).slice(Math.max(genres.length - (num - notRatedGenres.length), 0)),
                        ...notRatedGenres,
                    ];

                    return this.getFormattedGenres(name, genres);
                }

                return this.getFormattedGenres(name, notRatedGenres);
            },
            getLeastValuedGenres(name, data, num = 3) {
                const notRatedGenres = data.filter((genre) => genre.count === 0);

                if (notRatedGenres && notRatedGenres.length < num) {
                    let genres = data.filter((genre) => genre.count);
                    genres = [
                        ..._.orderBy(genres, ['value'], ['desc']).slice(Math.max(genres.length - (num - notRatedGenres.length), 0)),
                        ...notRatedGenres,
                    ];

                    return this.getFormattedGenres(name, genres);
                }

                return this.getFormattedGenres(name, notRatedGenres);
            },
            async downloadUsersCSV() {
                const data = await this.$axios.$get('/data/users');
                const formattedData = data.map((item) => {
                    const mostRated = this.getMostRatedGenres('most_rated', item.genres, 3);
                    const mostValued = this.getMostValuedGenres('most_valued', item.genres, 3);
                    const leastRated = this.getLeastRatedGenres('least_rated', item.genres, 3);
                    const mostRatedAll = this.getMostRatedGenres('most_rated_all', item.genres, 12);
                    const mostValuedAll = this.getMostRatedGenres('most_valued_all', item.genres, 12);
                    const leastRatedAll = this.getLeastRatedGenres('least_rated_all', item.genres, 12);

                    return {
                        user: item.user,
                        ...mostRated,
                        ...mostValued,
                        ...leastRated,
                        ...mostRatedAll,
                        ...mostValuedAll,
                        ...leastRatedAll,
                    };
                });
                const keys = {};
                formattedData.forEach(el => Object.keys(el).forEach(k => keys[k] = null));
                formattedData.forEach((el, ix, a) => a[ix] = Object.assign({}, keys, el));

                this.downloadCSV(formattedData, 'users.csv');
            },
        }
    };
</script>

<style lang="sass">
    .btn-download
        margin-bottom: 20px
</style>
