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
                delimiter: ',',
                encoding: 'utf8'
            });
            Download(parsedData, name, 'application/csv');
        }
    }
});
