import Vue from 'vue';
import Download from 'downloadjs';
import PapaParse from 'papaparse';
import * as _ from 'lodash';
import * as cleanTextUtils from 'clean-text-utils';

Vue.mixin({
    data() {
        return {
            relevantAlgorithm: null,
            relevantOptions: [
                { value: null, text: 'Default' },
                { value: 1, text: 'Boosting relevancy 1' },
                { value: 2, text: 'Boosting relevancy 2' }
            ],
            currentTab: null,
            genres: [],
            relevantCount: null,
            notRelevantCount: null,
            precision: null,
            recall10: null,
            recall15: null,
            f1Measure10: null,
            f1Measure15: null,
            take: 25,
        };
    },
    computed: {
        isGenerating () {
            return this.$store.state.generator.isGenerating;
        },
        isLogged() {
            return !!this.$auth.user;
        },
        isAdmin() {
            return this.isLogged ? this.$auth.user.admin : false;
        },
        userFullName() {
            const user = this.$auth.user;
            return user ? `${user.name} ${user.surname}` : '';
        },
        mostRatedGenres() {
            return this.getMostRatedGenres();
        },
        mostValuedGenres() {
            return this.getMostValuedGenres();
        },
        leastRatedGenres() {
            return this.getLeastRatedGenres();
        },
        leastValuedGenres() {
            return this.getLeastValuedGenres();
        },
        mostRatedGenresAll() {
            return this.getMostRatedGenres(12);
        },
        mostValuedGenresAll() {
            return this.getMostValuedGenres(12);
        },
        leastRatedGenresAll() {
            return this.getLeastRatedGenres(12);
        },
        leastValuedGenresAll() {
            return this.getLeastValuedGenres(12);
        }
    },
    methods: {
        async getMassData() {
            const relevances = [null, 1, 2];

            const response = await this.$axios.get(`/mass/data?type=${this.currentTab}`);
            if (this.currentTab && response.data.data && response.data.data.length) {
                const results = [];
                for (const relevanceType of relevances) {
                    this.relevantAlgorithm = relevanceType;
                    const relevanceName = this.relevantAlgorithm ? `Boosting relevancy ${this.relevantAlgorithm}` : 'Default';

                    const recs = response.data.data.map((item) => {
                        if (item.results.analyze.genres && item.results.analyze.genres.length) {
                            this.genres = item.results.analyze.genres;
                        }

                        const relevance = this.getRelevance(item.results[this.currentTab].movies, this.mostRatedGenresAll, this.leastRatedGenresAll);
                        this.relevantCount = this.getRelevantCount(relevance);
                        this.notRelevantCount = this.take - this.relevantCount;
                        this.precision = this.getFinalScore(this.take, this.relevantCount);
                        this.recall10 = this.getRecallScore(relevance, 10);
                        this.recall15 = this.getRecallScore(relevance, 15);
                        this.f1Measure10 = this.getFMeasureScore(relevance, this.take, 10);
                        this.f1Measure15 = this.getFMeasureScore(relevance, this.take, 15);
                        const recommendations = item.results[this.currentTab].movies.map((movie) => {
                            const relevanceForItem = relevance.find(item => item.id === movie.id);

                            return { ...movie, relevant: relevanceForItem ? relevanceForItem.relevant : null };
                        });

                        const data = {
                            id: item.id,
                            name: `${item.name} ${item.surname}`,
                            relevance: relevanceName,
                            relevant: Object.is(this.relevantCount, NaN) ? 0 : this.relevantCount,
                            not_relevant: Object.is(this.notRelevantCount, NaN) ? 0 : this.notRelevantCount,
                            precision: Object.is(this.precision, NaN) ? 0 : this.precision,
                            recall_10: Object.is(this.recall10, NaN) ? 0 : this.recall10,
                            recall_15: Object.is(this.recall15, NaN) ? 0 : this.recall15,
                            f1_measure_10: Object.is(this.f1Measure10, NaN) ? 0 : this.f1Measure10,
                            f1_measure_15: Object.is(this.f1Measure15, NaN) ? 0 : this.f1Measure15,
                        };

                        if (this.currentTab === 'cb') {
                            data['selected_id'] = item.results[this.currentTab].selected.id;
                            data['selected_name'] = item.results[this.currentTab].selected.title;
                        }

                        let counter = 0;

                        for (const movie of recommendations) {
                            counter += 1;
                            data[`${counter}_id`] = movie.id;
                            data[`${counter}_title`] = movie.title;
                            data[`${counter}_relevant`] = movie.relevant;
                        }

                        return data;
                    });

                    results.push(...recs);
                }

                this.relevantAlgorithm = null;

                this.downloadCSV(_.orderBy(results, ['id'], ['asc']), `${this.currentTab}.csv`);
            }
        },
        downloadCSV(data, name) {
            const parsedData = PapaParse.unparse(data, {
                delimiter: ';',
                encoding: 'utf8'
            });
            let txt = cleanTextUtils.strip.emoji(parsedData);
            txt = cleanTextUtils.replace.diacritics(txt);
            txt = cleanTextUtils.replace.smartChars(txt);
            Download(txt, name, 'text/csv');
        },
        getMostRatedGenres(num = 3) {
            const ratedGenres = this.genres.filter((genre) => genre.count);

            if (ratedGenres && ratedGenres.length >= num) {
                let genres = _.orderBy(this.genres, ['count'], ['desc']).slice(0, num);
                genres = _.orderBy(genres, ['count', 'allCount'], ['desc', 'desc']);

                return genres;
            }

            return [];
        },
        getMostValuedGenres(num = 3) {
            const ratedGenres = this.genres.filter((genre) => genre.count);

            if (ratedGenres && ratedGenres.length >= num) {
                let genres = _.orderBy(this.genres, ['value'], ['desc']).slice(0, num);
                genres = _.orderBy(genres, ['value', 'allCount'], ['desc', 'desc']);

                return genres;
            }

            return [];
        },
        getLeastRatedGenres(num = 3) {
            const notRatedGenres = this.genres.filter((genre) => genre.count === 0);

            if (notRatedGenres && notRatedGenres.length < num) {
                let genres = this.genres.filter((genre) => genre.count);
                genres = [
                    ..._.orderBy(genres, ['count'], ['desc']).slice(Math.max(genres.length - (num - notRatedGenres.length), 0)),
                    ...notRatedGenres,
                ];
                genres = _.orderBy(genres, ['count', 'allCount'], ['desc', 'desc']);

                return genres;
            }

            return _.orderBy(notRatedGenres, ['count', 'allCount'], ['desc', 'desc']);
        },
        getLeastValuedGenres(num = 3) {
            const notRatedGenres = this.genres.filter((genre) => genre.count === 0);

            if (notRatedGenres && notRatedGenres.length < num) {
                let genres = this.genres.filter((genre) => genre.count);
                genres = [
                    ..._.orderBy(genres, ['value'], ['desc']).slice(Math.max(genres.length - (num - notRatedGenres.length), 0)),
                    ...notRatedGenres,
                ];
                genres = _.orderBy(genres, ['value', 'allCount'], ['desc', 'desc']);

                return genres;
            }

            return _.orderBy(notRatedGenres, ['value', 'allCount'], ['desc', 'desc']);
        },
        getRelevance(movies, mostRatedGenresAll, leastRatedGenresAll) {
            const relevantGenres = mostRatedGenresAll.map(genre => genre.id);
            const notRelevantGenres = leastRatedGenresAll.map(genre => genre.id);

            return movies.map((movie) => {
                const genres = movie.genres.map(genre => genre.id);

                const movieRelevantGenres = genres.filter(genre => relevantGenres.includes(genre));
                const movieNotRelevantGenres = genres.filter(genre => notRelevantGenres.includes(genre));

                let relevant;
                if (this.relevantAlgorithm) {
                    if (this.relevantAlgorithm === 1) {
                        relevant = movieRelevantGenres.length > 0 && movieRelevantGenres.length > movieNotRelevantGenres.length;
                    } else if (this.relevantAlgorithm === 2) {
                        relevant = movieRelevantGenres.length > 0 && movieRelevantGenres.length >= movieNotRelevantGenres.length;
                    } else {
                        relevant = false;
                    }
                } else {
                    relevant = movieRelevantGenres.length > 0 && movieNotRelevantGenres.length === 0;
                }

                return { id: movie.id, relevant };
            });
        },
        getRelevantCount(items) {
            return items.reduce((count, item) => {
                return item.relevant ? count + 1 : count;
            }, 0);
        },
        getFinalScore(toTake, relevant) {
            return Math.round((relevant / toTake) * 100);
        },
        getRecallScore(results, n) {
            const topN = results.slice(0, n);
            const relevantCount = topN.reduce((count, item) => {
                return item.relevant ? count + 1 : count;
            }, 0);

            return Math.round((relevantCount / n) * 100);
        },
        getFMeasureScore(results, toTake, n) {
            const relevantItems = results.filter(item => item.relevant).length;
            const precision = this.getFinalScore(toTake, relevantItems);
            const recall = this.getRecallScore(results, n);
            return Math.round((2 * precision * recall) / (precision + recall));
        }
    }
});
