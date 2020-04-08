import Vue from 'vue';
import Router from 'vue-router';
import Ping from '../components/Ping.vue';
import SearchData from '../components/SearchData.vue';

Vue.prototype.test_url = 'http://localhost:5000';
Vue.prototype.api_url = 'http://licenta.eba-ivwtjfbm.us-east-2.elasticbeanstalk.com';
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/ping',
      name: 'Ping',
      component: Ping,
    },
    {
      path: '/search-data',
      name: 'SearchData',
      component: SearchData,
    },
  ],
});
