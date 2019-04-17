<template>
    <b-row v-if="(searchGenres && searchGenres.length > 0) && !customSearching">
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
</template>

<script>
    export default {
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
            }
        }
    };
</script>

<style lang="sass">
    .custom-search
        margin-top: 20px
        color: #ccc
</style>
