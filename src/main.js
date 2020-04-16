import 'bootstrap/dist/css/bootstrap.css';
import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8080';
// axios.defaults.headers.common['Access-Control-Max-Age'] = '5000';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
