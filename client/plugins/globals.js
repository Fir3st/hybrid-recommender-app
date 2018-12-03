import Vue from 'vue';
import VueTruncate from 'vue-truncate-filter';
import Breadcrumb from '../components/Breadcrumb.vue';

Vue.use(VueTruncate);
Vue.component('app-breadcrumb', Breadcrumb);
