<template>
    <b-tabs>
        <b-tab
            title="New algorithm"
            active
        >
            <NewAlgorithmTab />
        </b-tab>
    </b-tabs>
</template>

<script>
    import NewAlgorithmTab from '~/components/admin/playground/NewAlgorithm';

    export default {
        components: {
            NewAlgorithmTab,
        }
    };
</script>
