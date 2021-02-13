import Vue from 'vue';
import VueTruncate from 'vue-truncate-filter';
import Breadcrumb from '../components/Breadcrumb.vue';
import vSelect from 'vue-select';

Vue.use(VueTruncate);
Vue.component('AppBreadcrumb', Breadcrumb);
Vue.component('VSelect', vSelect);
