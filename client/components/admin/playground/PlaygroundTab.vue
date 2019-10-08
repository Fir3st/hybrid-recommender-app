<template>
    <b-tabs>
        <b-tab
            title="Content-based recommendations"
            active
        >
            <ContentBasedRecsTab />
        </b-tab>
        <b-tab
            title="Collaborative recommendations"
        >
            <CollaborativeRecsTab />
        </b-tab>
        <b-tab
            title="Hybrid recommendations"
        >
            <HybridRecsTab />
        </b-tab>
        <b-tab
            title="Query search"
        >
            <QuerySearchTab />
        </b-tab>
    </b-tabs>
</template>

<script>
    import ContentBasedRecsTab from '~/components/admin/playground/ContentBasedRecsTab';
    import CollaborativeRecsTab from '~/components/admin/playground/CollaborativeRecsTab';
    import HybridRecsTab from '~/components/admin/playground/HybridRecsTab';
    import QuerySearchTab from "~/components/admin/playground/QuerySearchTab";

    export default {
        components: {
            ContentBasedRecsTab,
            CollaborativeRecsTab,
            HybridRecsTab,
            QuerySearchTab
        }
    };
</script>
