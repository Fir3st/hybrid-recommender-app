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
                    :data="results"
                    stripe
                    style="width: 100%"
                    empty-text="No users found"
                >
                    <el-table-column
                        prop="id"
                        label="#"
                    />
                    <el-table-column
                        label="Posted to system"
                    >
                        <template slot-scope="scope">
                            {{ formatDate(scope.row.createdAt) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="User"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.user.name }} {{ scope.row.user.surname }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Actions"
                    >
                        <template slot-scope="scope">
                            <nuxt-link :to="`/admin/results/${scope.row.id}`">
                                <el-button
                                    icon="el-icon-search"
                                    circle
                                />
                            </nuxt-link>
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                @click="deleteResult(scope.row.id)"
                            />
                        </template>
                    </el-table-column>
                </el-table>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import moment from 'moment';
    import AdminPage from '~/components/admin/AdminPage';

    export default {
        extends: AdminPage,
        data() {
            return {
                pageTitle: 'Questionnaire results',
                breadcrumbs: [
                    { index: 0, name: 'results', path: null }
                ]
            };
        },
        async asyncData({ app }) {
            try {
                const results = await app.$axios.$get(`/results`);

                if (results && results.length > 0) {
                    return {
                        results
                    };
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        methods: {
            formatDate(date) {
                return moment(date).format('DD. MM. YYYY HH:mm');
            },
            async deleteResult(id) {
                try {
                    await this.$axios.$delete(`/results/${id}`);
                    const index = this.results.findIndex(item => item.id === id);
                    if (index > -1) {
                        this.results.splice(index, 1);
                    }
                    this.$notify({
                        title: 'Success',
                        message: `You have successfully deleted result with ID ${id}`,
                        type: 'success',
                        position: 'bottom-right'
                    });
                } catch (error) {
                    console.log(error.message);
                    this.$notify({
                        title: 'Success',
                        message: `Something went wrong`,
                        type: 'success',
                        position: 'bottom-right'
                    });
                }
            }
        }
    };
</script>
