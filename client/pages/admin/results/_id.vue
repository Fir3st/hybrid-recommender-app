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
                        <p><strong>Posted:</strong> {{ result.createdAt }}</p>
                        <p><strong>User:</strong> {{ result.user.name }} {{ result.user.surname }}</p>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h2>Questionnaire details</h2>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <p><strong>Favourite genres: </strong> {{ result.favouriteGenres.map(item => item.name).join(', ') }}</p>
                        <p><strong>Not favourite genres: </strong> {{ result.notFavouriteGenres.map(item => item.name).join(', ') }}</p>
                        <h3>Rated items</h3>
                        <ul>
                            <li
                                v-for="item in result.items"
                                :key="item.id"
                            >
                                {{ item.title }} (rating: {{ item.rating }})
                            </li>
                        </ul>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h2>Settings</h2>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h3>General settings</h3>
                        <p><strong>Movie:</strong> {{ result.settings.general.selectedItem.title }} (ID: {{ result.settings.general.movieId }})</p>
                        <p><strong>Take:</strong> {{ result.settings.general.take }}</p>

                        <h3>Content-based settings</h3>
                        <p><strong>Recommender algorithm:</strong> {{ result.settings.cb.recType }}</p>
                        <p><strong>Order by:</strong> {{ result.settings.cb.orderBy }}</p>

                        <h3>Collaborative filtering settings</h3>
                        <p><strong>Recommender algorithm:</strong> {{ result.settings.cbf.recType }}</p>
                        <p><strong>Similarity function:</strong> {{ result.settings.cbf.similarityType }}</p>
                        <p><strong>Content-based algorithm used for similarity with rated items:</strong> {{ result.settings.cbf.similaritySource }}</p>
                        <p><strong>Genre(s):</strong> {{ result.settings.cbf.genre.join(', ') }}</p>
                        <p><strong>Item type:</strong> {{ result.settings.cbf.movieType }}</p>
                        <p><strong>Order by:</strong> {{ result.settings.cbf.orderBy }}</p>

                        <h3>Hybrid settings</h3>
                        <p><strong>Hybrid type:</strong> {{ result.settings.hybrid.hybridType }}</p>
                        <p><strong>Collaborative algorithm:</strong> {{ result.settings.hybrid.recType }}</p>
                        <p><strong>Similarity function:</strong> {{ result.settings.hybrid.similarityType }}</p>
                        <p><strong>Content-based algorithm:</strong> {{ result.settings.hybrid.similaritySource }}</p>
                        <p><strong>Genre(s):</strong> {{ result.settings.hybrid.genre.join(', ') }}</p>
                        <p><strong>Item type:</strong> {{ result.settings.hybrid.movieType }}</p>
                        <p><strong>Order by:</strong> {{ result.settings.hybrid.orderBy }}</p>

                        <h3>Expert system settings</h3>
                        <p><strong>Recommender algorithm:</strong> {{ result.settings.expert.recType }}</p>
                        <p><strong>Similarity function:</strong> {{ result.settings.expert.similarityType }}</p>
                        <p><strong>Content-based algorithm used for similarity with rated items:</strong> {{ result.settings.expert.similaritySource }}</p>
                        <p><strong>Genre(s):</strong> {{ result.settings.expert.genre.join(', ') }}</p>
                        <p><strong>Item type:</strong> {{ result.settings.expert.movieType }}</p>
                        <p><strong>Order by:</strong> {{ result.settings.expert.orderBy }}</p>
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

                        <h3>Collaborative results</h3>
                        <p><strong>Relevant:</strong> {{ countRelevance('cbfResults', 'relevant') }}</p>
                        <p><strong>Not relevant:</strong> {{ countRelevance('cbfResults', 'notRelevant') }}</p>

                        <h3>Hybrid results</h3>
                        <p><strong>Relevant:</strong> {{ countRelevance('hybridResults', 'relevant') }}</p>
                        <p><strong>Not relevant:</strong> {{ countRelevance('hybridResults', 'notRelevant') }}</p>

                        <h3>Expert results</h3>
                        <p><strong>Relevant:</strong> {{ countRelevance('expertResults', 'relevant') }}</p>
                        <p><strong>Not relevant:</strong> {{ countRelevance('expertResults', 'notRelevant') }}</p>
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
                        <ul>
                            <li
                                v-for="res in result.results.cbResults"
                                :key="res.id"
                            >
                                {{ res.title }} (<strong>relevant:</strong> {{ res.relevance ? 'yes' : 'no' }})
                            </li>
                        </ul>

                        <h3>Collaborative results</h3>
                        <ul>
                            <li
                                v-for="res in result.results.cbfResults"
                                :key="res.id"
                            >
                                {{ res.title }} (<strong>relevant:</strong> {{ res.relevance ? 'yes' : 'no' }})
                            </li>
                        </ul>

                        <h3>Hybrid results</h3>
                        <ul>
                            <li
                                v-for="res in result.results.hybridResults"
                                :key="res.id"
                            >
                                {{ res.title }} (<strong>relevant:</strong> {{ res.relevance ? 'yes' : 'no' }})
                            </li>
                        </ul>

                        <h3>Expert results</h3>
                        <ul>
                            <li
                                v-for="res in result.results.expertResults"
                                :key="res.id"
                            >
                                {{ res.title }} (<strong>relevant:</strong> {{ res.relevance ? 'yes' : 'no' }})
                            </li>
                        </ul>
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
    import AdminPage from '~/components/admin/AdminPage';

    export default {
        extends: AdminPage,
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
            }
        },
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
            }
        }
    };
</script>
