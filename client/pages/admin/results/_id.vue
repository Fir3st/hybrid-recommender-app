<template>
    <div class="admin-page">
        <app-breadcrumb :items="breadcrumbs" />
        <b-row v-if="result">
            <b-col>
                <b-row>
                    <b-col>
                        <h1>{{ pageTitle }}</h1>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <p><strong>ID:</strong> {{ result.id }}</p>
                        <p><strong>Posted:</strong> {{ formatDate(result.createdAt) }}</p>
                        <p><strong>User:</strong> {{ result.user.name }} {{ result.user.surname }} (ID: {{ result.user.id }})</p>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h2>Questionnaire details</h2>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h3>Rated items</h3>
                        <ul>
                            <li
                                v-for="item in result.items"
                                :key="item.id"
                            >
                                <nuxt-link :to="`/admin/movies/${item.id}`">
                                    {{ item.title }}
                                </nuxt-link>(<strong>rating</strong>: {{ item.rating }})
                            </li>
                        </ul>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h2>Results</h2>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h3>Content-based results</h3>
                        <p><strong>Relevant:</strong> {{ countRelevance('cbResults', 'relevant') }}</p>
                        <p><strong>Not relevant:</strong> {{ countRelevance('cbResults', 'notRelevant') }}</p>
                        <p><strong>Precision:</strong> {{ getFinalScore(countRelevance('cbResults', 'relevant')) }}%</p>

                        <h3>Collaborative results</h3>
                        <p><strong>Relevant:</strong> {{ countRelevance('cbfResults', 'relevant') }}</p>
                        <p><strong>Not relevant:</strong> {{ countRelevance('cbfResults', 'notRelevant') }}</p>
                        <p><strong>Precision:</strong> {{ getFinalScore(countRelevance('cbfResults', 'relevant')) }}%</p>

                        <h3>Hybrid results</h3>
                        <p><strong>Relevant:</strong> {{ countRelevance('hybridResults', 'relevant') }}</p>
                        <p><strong>Not relevant:</strong> {{ countRelevance('hybridResults', 'notRelevant') }}</p>
                        <p><strong>Precision:</strong>  {{ getFinalScore(countRelevance('hybridResults', 'relevant')) }}%</p>

                        <h3>Hybrid system (expert) results</h3>
                        <p><strong>User's favourite genres: </strong> {{ result.favouriteGenres.map(item => item.genre.name).join(', ') }}</p>
                        <p><strong>User's not favourite genres: </strong> {{ result.notFavouriteGenres.map(item => item.genre.name).join(', ') }}</p>
                        <p><strong>Relevant:</strong> {{ countRelevance('expertResults', 'relevant') }}</p>
                        <p><strong>Not relevant:</strong> {{ countRelevance('expertResults', 'notRelevant') }}</p>
                        <p><strong>Precision:</strong> {{ getFinalScore(countRelevance('expertResults', 'relevant')) }}%</p>
                        <p><strong>Recall (TOP 15):</strong> {{ getRecallScore('expertResults', 15) }}%</p>
                        <p><strong>F1-Measure (TOP 15):</strong> {{ getFMeasureScore('expertResults', 15) }}%</p>
                        <p><strong>Recall (TOP 10):</strong> {{ getRecallScore('expertResults', 10) }}%</p>
                        <p><strong>F1-Measure (TOP 10):</strong> {{ getFMeasureScore('expertResults', 10) }}%</p>

                        <h3>Cluster system results</h3>
                        <p><strong>TOP 3 genres: </strong> {{ result.top3.map(item => item.genre.name).join(', ') }}</p>
                        <p><strong>Least 3 genres: </strong> {{ result.least3.map(item => item.genre.name).join(', ') }}</p>
                        <p><strong>TOP 12 genres: </strong> {{ result.top12.map(item => item.genre.name).join(', ') }}</p>
                        <p><strong>Least 12 genres: </strong> {{ result.least12.map(item => item.genre.name).join(', ') }}</p>
                        <p><strong>Relevant:</strong> {{ countRelevance('clusterResults', 'relevant') }}</p>
                        <p><strong>Not relevant:</strong> {{ countRelevance('clusterResults', 'notRelevant') }}</p>
                        <p><strong>Precision:</strong> {{ getFinalScore(countRelevance('clusterResults', 'relevant')) }}%</p>
                        <p><strong>Recall (TOP 15):</strong> {{ getRecallScore('clusterResults', 15) }}%</p>
                        <p><strong>F1-Measure (TOP 15):</strong> {{ getFMeasureScore('clusterResults', 15) }}%</p>
                        <p><strong>Recall (TOP 10):</strong> {{ getRecallScore('clusterResults', 10) }}%</p>
                        <p><strong>F1-Measure (TOP 10):</strong> {{ getFMeasureScore('clusterResults', 10) }}%</p>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h2>Detailed results</h2>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h3>Content-based results</h3>
                        <b-table
                            striped
                            hover
                            :items="cbData"
                        />

                        <h3>Collaborative results</h3>
                        <b-table
                            striped
                            hover
                            :items="cbfData"
                        />

                        <h3>Hybrid results</h3>
                        <b-table
                            striped
                            hover
                            :items="hybridData"
                        />

                        <h3>Hybrid system (expert) results</h3>
                        <b-table
                            striped
                            hover
                            :items="expertData"
                        />
                        <h3>Cluster system results</h3>
                        <b-table
                            striped
                            hover
                            :items="clusterData"
                        />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-else>
            <b-col>
                <h1>Result not found</h1>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import moment from 'moment';
    import AdminPage from '~/components/admin/AdminPage';

    export default {
        extends: AdminPage,
        async asyncData ({ app, params }) {
            try {
                const result = await app.$axios.$get(`/results/${params.id}`);

                if (result) {
                    return {
                        result
                    };
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        data() {
            return {
                breadcrumbs: [
                    { index: 0, name: 'results', path: '/admin/results' },
                    { index: 1, name: 'result detail' , path: null }
                ]
            };
        },
        computed: {
            pageTitle() {
                return (this.result) ? `Result with ID ${this.result.id}` : 'Result detail';
            },
            cbData() {
                return this.result.results.cbResults.map((item) => {
                    return {
                        '#': item.id,
                        title: item.title,
                        relevant: item.relevance ? 'yes' : 'no',
                        genres: item.genres ? item.genres.map(item => item.name).join(', ') : '-',
                        similarity: item.similarity || '-'
                    };
                });
            },
            cbfData() {
                return this.result.results.cbfResults.map((item) => {
                    return {
                        '#': item.id,
                        title: item.title,
                        relevant: item.relevance ? 'yes' : 'no',
                        genres: item.genres ? item.genres.map(item => item.name).join(', ') : '-',
                        predicated_rating: item.rating || '-'
                    };
                });
            },
            hybridData() {
                return this.result.results.hybridResults.map((item) => {
                    return {
                        '#': item.id,
                        title: item.title,
                        relevant: item.relevance ? 'yes' : 'no',
                        genres: item.genres ? item.genres.map(item => item.name).join(', ') : '-',
                        predicated_rating: item.rating && typeof item.rating === 'number' ? item.rating : '-',
                        similarity: item.similarity || '-'
                    };
                });
            },
            expertData() {
                return this.result.results.expertResults.map((item) => {
                    return {
                        '#': item.id,
                        title: item.title,
                        relevant: item.relevance ? 'yes' : 'no',
                        genres: item.genres ? item.genres.map(item => item.name).join(', ') : '-',
                        augmented_rating: item.augmentedRating || '-',
                        predicated_rating: item.rating || '-',
                        es_score: item.esScore || '-'
                    };
                });
            },
            clusterData() {
                return this.result.results.clusterResults.map((item) => {
                    return {
                        '#': item.id,
                        title: item.title,
                        relevant: item.relevance ? 'yes' : 'no',
                        genres: item.genres ? item.genres.map(item => item.name).join(', ') : '-',
                        predicated_rating: item.predictedRating || '-'
                    };
                });
            },
        },
        methods: {
            countRelevance(system, type) {
                if (type === 'relevant') {
                    return this.result.results[system].reduce((count, item) => {
                        return item.relevance ? count + 1 : count;
                    }, 0);
                } else {
                    return this.result.results[system].reduce((count, item) => {
                        return !item.relevance ? count + 1 : count;
                    }, 0);
                }
            },
            formatDate(date) {
                return moment(date).format('DD. MM. YYYY HH:mm');
            },
            getFinalScore(relevant) {
                const total = this.result.settings.take;
                return Math.round((relevant / total) * 100);
            },
            getRecallScore(system, n) {
                const topN = this.result.results[system].slice(0, n);
                const relevantCount = topN.reduce((count, item) => {
                    return item.relevance ? count + 1 : count;
                }, 0);

                return Math.round((relevantCount / n) * 100);
            },
            getFMeasureScore(system, n) {
                const precision = this.getFinalScore(this.countRelevance(system, 'relevant'));
                const recall = this.getRecallScore(system, n);
                return Math.round((2 * precision * recall) / (precision + recall));
            }
        }
    };
</script>
