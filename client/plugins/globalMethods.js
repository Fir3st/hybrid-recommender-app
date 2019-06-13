import Vue from 'vue';
import Download from 'downloadjs';
import PapaParse from 'papaparse';

Vue.mixin({
    methods: {
        downloadCSV(data, name) {
            const parsedData = PapaParse.unparse(data, {
                delimiter: ',',
                encoding: 'utf8'
            });
            Download(parsedData, name, 'application/csv');
        }
    }
});
