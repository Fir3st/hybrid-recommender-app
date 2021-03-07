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
                isGenerating: null,
                timer: null,
            };
        },
        async mounted() {
            await this.getStatus();
        },
        methods: {
            async getStatus() {
                const status = await this.$axios.get('/mass/status');
                if (status.data.status) {
                    this.isGenerating = status.data.status == 1;
                    if (!this.isGenerating) {
                        clearInterval(this.timer);
                    }
                }
            },
            async runMassGenerating() {
                await this.$axios.post('/mass/run');
                this.isGenerating = true;
                setInterval(this.getStatus, 15000);
            },
            // async getMassData() {
            //     const response = await this.$axios.get('/mass/data');
            //     if (response.data.data && response.data.data.length) {
            //         const recs = response.data.data.map((item) => {
            //             const data = {
            //                 id: item.id,
            //                 name: `${item.name} ${item.surname}`
            //             };
            //             let counter = 0;
            //
            //             for (const movie of item.massResult.cbf.movies) {
            //                 counter += 1;
            //                 data[`CBF_${counter}_id`] = movie.id;
            //                 data[`CBF_${counter}_title`] = movie.title;
            //             }
            //
            //             return data;
            //         });
            //
            //         this.downloadCSV(recs, `mass_data.csv`);
            //     }
            // }
        }
    };
</script>
