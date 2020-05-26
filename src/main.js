import 'bootstrap/dist/css/bootstrap.css';
import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import VueToastify from "vue-toastify";

import axios from 'axios';

Vue.use(BootstrapVue);
Vue.use(VueToast);
Vue.use(VueSweetalert2);
Vue.use(VueToastify);

Vue.config.productionTip = false;
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8080';
// axios.defaults.headers.common['Access-Control-Max-Age'] = '5000';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
