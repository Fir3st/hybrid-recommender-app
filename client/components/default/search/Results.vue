<template>
    <b-row>
        <b-col>
            <b-row v-if="!searching">
                <b-col v-if="movies && movies.length > 0">
                    <b-row>
                        <b-col>
                            <h2 v-if="customSearching">
                                {{ count }} results for {{ customSearchText }}:
                            </h2>
                            <h2 v-else>
                                {{ count }} results for '{{ searchTerm }}':
                            </h2>
                        </b-col>
                    </b-row>
                    <movie-list
                        :movies="movies"
                        :additional-info="true"
                        :show-rating-buttons="true"
                        :rating="true"
                        :analytics="true"
                    />
                    <load-more
                        :count="count"
                        :movies="movies"
                        :load-more="loadMore"
                    />
                </b-col>
                <b-col v-else>
                    <b-row>
                        <b-col>
                            <h2 v-if="customSearching">
                                No results found for {{ customSearchText }}.
                            </h2>
                            <h2 v-else>
                                No results found for search term '{{ searchTerm }}'.
                            </h2>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <loading v-else />
        </b-col>
    </b-row>
</template>

<script>
    import MovieList from '~/components/default/MovieList';
    import Loading from '~/components/default/search/Loading';
    import LoadMore from '~/components/default/search/LoadMore';

    export default {
        components: {
            MovieList,
            Loading,
            LoadMore
        },
        props: {
            searching: {
                type: Boolean,
                required: true
            },
            movies: {
                type: Array,
                required: true
            },
            customSearching: {
                type: Boolean,
                required: true
            },
            customSearchText: {
                type: String,
                required: true
            },
            searchTerm: {
                type: String,
                required: true
            },
            count: {
                type: Number,
                required: true
            },
            loadMore: {
                type: Function,
                required: true
            }
        }
    };
</script>

<style lang="sass" scoped>
    h2
        margin: 20px 0
</style>
