<template>
    <b-tabs>
        <b-tab
            title="New algorithm"
            active
        >
            <NewAlgorithmTab />
        </b-tab>
        <b-tab
            title="New algorithm - manual entries"
        >
            <NewAlgorithmTabManual />
        </b-tab>
    </b-tabs>
</template>

<script>
    import NewAlgorithmTab from '~/components/admin/playground/NewAlgorithm';
    import NewAlgorithmTabManual from '~/components/admin/playground/NewAlgorithmManual';

    export default {
        components: {
            NewAlgorithmTab,
            NewAlgorithmTabManual,
        }
    };
</script>
