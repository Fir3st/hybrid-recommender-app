<template>
    <ul
        class="suggestions"
    >
        <SuggestionsListItem
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            :suggestion="suggestion"
            :on-select="onSelect"
        />
    </ul>
</template>

<script>
    import SuggestionsListItem from "./SuggestionsListItem";

    export default {
        components: {
            SuggestionsListItem
        },
        props: {
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
    .suggestions
        list-style-type: none
        padding: 0
        margin-top: 5px
        width: 100%
        z-index: 55555555
</style>
