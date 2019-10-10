<template>
    <li @click="selectItem">
        {{ suggestion.title }} ({{ suggestion.year }})
    </li>
</template>

<script>
    export default {
        props: {
            suggestion: {
                type: Object,
                required: true
            },
            onSelect: {
                type: Function,
                required: true
            }
        },
        methods: {
            selectItem() {
                this.onSelect(this.suggestion.id);
            }
        }
    };
</script>

<style lang="sass" scoped>
    li
        padding: 10px
        background: #333
        cursor: pointer
        border-bottom: 1px solid #000
</style>
