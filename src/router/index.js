import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '../components/Welcome';
import SearchData from '../components/SearchData.vue';
import AuthorPublications from '../components/AuthorPublications';

Vue.prototype.test_url = 'http://localhost:5000';
Vue.prototype.api_url = 'http://flask-env.eba-er8yzmsp.us-east-2.elasticbeanstalk.com';
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome,
    },
    {
      path: '/search-data',
      name: 'SearchData',
      component: SearchData,
    },
  ],
});
