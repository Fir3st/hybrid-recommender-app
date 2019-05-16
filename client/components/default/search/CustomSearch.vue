<template>
    <b-row v-if="(searchGenres && searchGenres.length > 0) && !customSearching">
        <b-col>
            <b-row>
                <b-col>
                    <p class="custom-search">
                        Do you want to search
                        <a
                            href="#"
                            @click="customSearch"
                        >{{ customSearchText }}</a>?
                    </p>
                </b-col>
            </b-row>
            <include-rated
                :on-change="onChange"
                :include-rated="includeRated"
            />
        </b-col>
    </b-row>
</template>

<script>
    import IncludeRated from '~/components/default/search/IncludeRatedCheckbox';

    export default {
        components: {
            IncludeRated
        },
        props: {
            searchGenres: {
                type: Array,
                required: true
            },
            customSearching: {
                type: Boolean,
                required: true
            },
            customSearch: {
                type: Function,
                required: true
            },
            customSearchText: {
                type: String,
                required: true
            },
            onChange: {
                type: Function,
                required: true
            },
            includeRated: {
                type: Boolean,
                required: true
            }
        }
    };
</script>

<style lang="sass">
    .custom-search
        margin-top: 20px
        color: #ccc
</style>
