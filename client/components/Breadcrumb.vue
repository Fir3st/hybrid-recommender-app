<template>
    <b-row>
        <b-col>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
                <el-breadcrumb-item
                    v-for="item in breadcrumbs"
                    :key="item.index"
                    :to="{ path: item.path }">{{ item.name }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </b-col>
    </b-row>
</template>

<script>
    import * as pathToRegexp from 'path-to-regexp';

    export default {
        props: {
            items: {
                type: Array,
                required: false,
                default: null
            }
        },
        data() {
            return {
                breadcrumbs: [],
            };
        },
        async mounted() {
            if (this.items) {
                this.breadcrumbs = this.items;
            }
            else {
                await this.updateBreadcrumbs();
            }
        },
        methods: {
            async updateBreadcrumbs() {
                // TODO: will need some rework when we'll have more complex paths, especially splitRouteNames()
                // TODO: also, this function should be called when updating the route (so probably beforeRouteEnter and beforeRouteUpdate)
                //  TODO: and when changing the parent's page title (this.pageTitle = ...), we should probably emit an event and react to it here and re-generate the crumbs
                const routeName = this.$route.name;
                const params = this.$route.params;
                const availableRoutes = this.$router.options.routes;
                const names = this.splitRouteNames(routeName);
                const mapNameToRoute = (name) => availableRoutes.find(route => route.name === name);
                // some routes produced by splitRouteNames() don't exist, so we need to filter only those that exist and map them to their routes
                const routes = names.filter(mapNameToRoute).map(mapNameToRoute);
                this.breadcrumbs = await this.getBreadcrumbs(routes, params);
            },
            splitRouteNames(path) {
                // receives a path like admin-projects-edit-id
                // and splits it from the right by the character -
                // ['admin', 'admin-projects', 'admin-projects-edit', 'admin-projects-edit-id']
                let p = path;
                let i;
                const paths = [];

                do {
                    paths.push(p);
                    i = p.lastIndexOf('-');
                    p = p.substring(0, i);
                } while (p !== '');

                paths.reverse();
                return paths;
            },
            getBreadcrumbs(routes, params) {
                const crumbs = [];
                let i = 0;
                const promises = routes.map((route) => {
                    const crumb = {
                        index: i++
                    };
                    return route.component()
                        .then((component) => {
                            const headTitle = component.head && component.head() && component.head().title;
                            const dataTitle = component.data && component.data() && component.data().pageTitle;
                            // use the engine Vue Router uses in their path, reverse engineer real path
                            // turns /admin/projects/edit/:id? + { id: "0" } into /admin/projects/edit/0
                            const toPath = pathToRegexp.compile(route.path);
                            const path = toPath(params);
                            crumbs.push({
                                ...crumb,
                                path,
                                name: headTitle || dataTitle || route.name
                            });
                        });
                });
                return Promise.all(promises)
                    .then(() => {
                        crumbs.sort((a, b) => a.index - b.index);
                        return crumbs;
                    });
            }
        }
    };
</script>
