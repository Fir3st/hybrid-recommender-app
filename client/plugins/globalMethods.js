import Vue from 'vue';
import Download from 'downloadjs';
import PapaParse from 'papaparse';

Vue.mixin({
    computed: {
        isLogged() {
            return !!this.$auth.user;
        },
        isAdmin() {
            return this.isLogged ? this.$auth.user.admin : false;
        },
        userFullName() {
            const user = this.$auth.user;
            return user ? `${user.name} ${user.surname}` : '';
        }
    },
    methods: {
        downloadCSV(data, name) {
            const parsedData = PapaParse.unparse(data, {
                delimiter: ';',
                encoding: 'utf8'
            });
            Download(parsedData, name, 'application/csv');
        },
        getRelevance(movies, mostRatedGenresAll, leastRatedGenresAll) {
            const relevantGenres = mostRatedGenresAll.map(genre => genre.id);
            const notRelevantGenres = leastRatedGenresAll.map(genre => genre.id);

            return movies.map((movie) => {
                const genres = movie.genres.map(genre => genre.id);

                const movieRelevantGenres = genres.filter(genre => relevantGenres.includes(genre));
                const movieNotRelevantGenres = genres.filter(genre => notRelevantGenres.includes(genre));

                let relevant;
                if (movieRelevantGenres.length > 0 && movieNotRelevantGenres.length === 0) {
                    relevant = true;
                } else if (movieRelevantGenres.length === 0 && movieNotRelevantGenres.length > 0) {
                    relevant = false;
                } else if (movieRelevantGenres.length > 0 && movieNotRelevantGenres.length > 0) {
                    relevant = movieRelevantGenres.length > movieNotRelevantGenres.length;
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
