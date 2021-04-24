import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import store from './store';
import * as filters from './utils/filters.js';
import './plugins/firebase';

import axios from 'axios'; // import axios    //https://mishka.kr/2020/02/19/axios/
Vue.prototype.$axios = axios; // prototype에 axios 추가

Vue.config.productionTip = false;

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
