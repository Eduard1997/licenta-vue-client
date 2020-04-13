import 'bootstrap/dist/css/bootstrap.css';
import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
