<template>
    <div>
        <b-row class="mb-2">
            <b-col>
                <b-button size="sm" variant="primary" :disabled="isGenerating" @click="runMassGenerating">
                    Run mass generating
                </b-button>
            </b-col>
        </b-row>
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
                title="Expert system recommendations"
            >
                <ExpertBasedRecsTab />
            </b-tab>
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
    </div>
</template>

<script>
    import NewAlgorithmTab from '~/components/admin/playground/NewAlgorithm';
    import NewAlgorithmTabManual from '~/components/admin/playground/NewAlgorithmManual';
    import ContentBasedRecsTab from '~/components/admin/playground/ContentBasedRecsTab';
    import CollaborativeRecsTab from '~/components/admin/playground/CollaborativeRecsTab';
    import HybridRecsTab from '~/components/admin/playground/HybridRecsTab';
    import ExpertBasedRecsTab from '~/components/admin/playground/ExpertBasedRecsTab';
    import { mapMutations } from 'vuex';

    export default {
        components: {
            ContentBasedRecsTab,
            CollaborativeRecsTab,
            HybridRecsTab,
            NewAlgorithmTab,
            NewAlgorithmTabManual,
            ExpertBasedRecsTab
        },
        data() {
            return {
                timer: null,
            };
        },
        async mounted() {
            await this.getStatus();
        },
        methods: {
            ...mapMutations({
                setIsGenerating: 'generator/setIsGenerating'
            }),
            async getStatus() {
                const status = await this.$axios.get('/mass/status');
                if (status.data.status) {
                    this.setIsGenerating(status.data.status == 1);
                    if (!this.isGenerating) {
                        clearInterval(this.timer);
                    }
                }
            },
            async runMassGenerating() {
                await this.$axios.post('/mass/run');
                this.setIsGenerating(true);
                setInterval(this.getStatus, 20000);
            },
        }
    };
</script>
