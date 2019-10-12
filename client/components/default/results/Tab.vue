<template>
    <ul>
        <TabItem
            v-for="recommendation in recommendations"
            :key="recommendation.id"
            :recommendation="recommendation"
            :rec-type="recType"
            :set-relevance-handler="setRelevanceHandler"
        />
    </ul>
</template>

<script>
    import TabItem from './TabItem';

    export default {
        components: {
            TabItem
        },
        props: {
            recommendations: {
                type: Array,
                required: true
            },
            recType: {
                type: String,
                required: true
            },
            setRelevanceHandler: {
                type: Function,
                required: true
            }
        }
    };
</script>

<style lang="sass" scoped>
    ul
        list-style-type: none
        margin: 0
        padding: 0
</style>
