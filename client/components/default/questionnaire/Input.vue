<template>
    <b-row>
        <b-col>
            <input
                :value="searchTerm"
                class="form-control search"
                type="text"
                placeholder="Type to search"
                @input="onChange"
            />
            <SuggestionsList
                :suggestions="suggestions"
                :on-select="onSelect"
            />
        </b-col>
    </b-row>
</template>

<script>
    import SuggestionsList from "./SuggestionsList";

    export default {
        components: {
            SuggestionsList,
        },
        props: {
            onChange: {
                type: Function,
                required: true
            },
            searchTerm: {
                type: String,
                required: true
            },
            suggestions: {
                type: Array,
                required: true
            },
            onSelect: {
                type: Function,
                required: true
            }
        }
    };
</script>

<style lang="sass" scoped>
    .search
        background: transparent
        border: 0
        font-size: 24px
        padding: 20px 10px
        border-bottom: 1px solid #17a2b8
        color: #fff
    .search:focus
        background: transparent
        color: #fff
        outline: none
        -webkit-box-shadow: none !important
        -moz-box-shadow: none !important
        box-shadow: none !important
</style>
