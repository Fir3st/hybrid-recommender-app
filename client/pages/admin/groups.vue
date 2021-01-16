<template lang="pug">
    .admin-page
        app-breadcrumb(:items="breadcrumbs")
        .b-row
            .b-col
                h1 {{ pageTitle }}
        .b-row
            .b-col
                b-table(:items="mappedGroups", :fields="fields")
                    template(#cell(actions)="row")
                        b-button(size="sm", @click="info(row.item, row.index, $event.target)", class="mr-1") Users
        .b-row
            b-col(class="text-center")
                b-button(@click="handleShowMore", :disabled="disabled") Show more
        b-modal(:id="infoModal.id", :title="infoModal.title", ok-only, @hide="resetInfoModal")
            h3 MovieLens
            ul(class="text-left")
                li(v-for="item in infoModal.movielens") {{ item }}
            h3 Others
            ul(class="text-left")
                li(v-for="item in infoModal.others") {{ item }}
</template>

<script>
    import AdminPage from '~/components/admin/AdminPage';

    export default {
        extends: AdminPage,
        async asyncData ({ app }) {
            try {
                const result = await app.$axios.$get('/groups');

                if (result) {
                    return {
                        users: result.users,
                        genres: result.genres,
                        groups: result.groups,
                    };
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        data() {
            return {
                pageTitle: 'Groups',
                breadcrumbs: [
                    { index: 0, name: 'groups', path: null }
                ],
                users: {},
                genres: {},
                groups: {},
                limit: 25,
                disabled: false,
                infoModal: {
                    id: 'info-modal',
                    title: '',
                    movielens: [],
                    others: []
                },
                fields: [
                    { key: 'id', label: '#' },
                    { key: 'title', label: 'Title' },
                    { key: 'cnt', label: 'Count' },
                    { key: 'movielens', label: 'MovieLens count' },
                    { key: 'others', label: 'Others count' },
                    { key: 'actions', label: 'Actions' },
                ]
            };
        },
        computed: {
            mappedGroups() {
                const groups = [];
                for (const group of Object.keys(this.groups).slice(0, this.limit)) {
                    const mostTitle = `${this.groups[group].most.map(item => this.genres[item].name).join(', ')}`;
                    const leastTitle = `${this.groups[group].least.map(item => this.genres[item].name).join(', ')}`;
                    groups.push({
                        id: group,
                        title: `${mostTitle} - ${leastTitle}`,
                        movielens: this.groups[group].countMovieLens,
                        others: this.groups[group].countOthers,
                        cnt: this.groups[group].countMovieLens + this.groups[group].countOthers
                    });
                }

                return groups;
            }
        },
        methods: {
            handleShowMore() {
                this.limit += 25;
            },
            info(item, index, button) {
                this.infoModal.title = item.title;
                for (const user of this.groups[item.id].users) {
                    const text = `${this.users[user].name} ${this.users[user].surname} (ID: ${user})`;
                    if (this.users[user].id >= 1500) {
                        this.infoModal.others.push(text);
                    } else {
                        this.infoModal.movielens.push(text);
                    }
                }
                // eslint-disable-next-line vue/custom-event-name-casing
                this.$root.$emit('bv::show::modal', this.infoModal.id, button);
            },
            resetInfoModal() {
                this.infoModal.title = '';
                this.infoModal.movielens = [];
                this.infoModal.others = [];
            },
        }
    };
</script>

<style lang="sass" scoped>
    h2
        margin: 20px 0
</style>
