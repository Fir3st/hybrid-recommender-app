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
        computed: {
            ...mapGetters({
                users: 'users/users',
                count: 'users/count',
                take: 'users/take',
                skip: 'users/skip',
                currentPage: 'users/currentPage'
            })
        },
        async fetch({ store }) {
            await store.dispatch('users/setUsers');
            await store.dispatch('users/setCount');
        },
        methods: {
            ...mapActions({
                setSkip: 'users/setSkip',
                setCurrentPage: 'users/setCurrentPage'
            }),
            handlePrev() {
                if ((this.skip - this.take) >= 0) {
                    this.setCurrentPage(this.currentPage - 1);
                    this.setSkip(this.skip - this.take);
                }
            },
            handleNext() {
                if ((this.skip + this.take) < this.count) {
                    this.setCurrentPage(this.currentPage + 1);
                    this.setSkip(this.skip + this.take);
                }
            },
            handleChangePage(pageNum) {
                this.setCurrentPage(pageNum);
                this.setSkip(this.take * (pageNum - 1));
            }
        }
    };
</script>
