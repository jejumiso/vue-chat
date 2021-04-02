import Vue from 'vue';
import Vuex from 'vuex';
import { loginUser } from '@/api/auth';
import { saveAuthToCookie, saveUserToCookie, getUserFromCookie, deleteCookie } from '@/utils/cookies.js';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		nickname: getUserFromCookie() || '',
		user: {},
		token: '',
		toID: '',
		toState: '', //부재중/통화가능/통화중/OFF/통화일시정지중
		toIs: '', // ture,false : 통화가능 여부
		fromID: '',
	},
	getters: {
		isLoggedIn(state) {
			return !!state.token || getUserFromCookie();
		},
		userToken(state) {
			return state.token;
		},
	},
	mutations: {
		SET_USER(state, user) {
			state.user = user;
			console.log('state.user : ');
		},
		SET_TOKEN(state, token) {
			state.token = token;
		},
		LOGOUT(state) {
			state.user = null;
			state.token = null;
			deleteCookie('til_auth');
			deleteCookie('til_user');
			console.log('로그아웃');
		},
	},
	actions: {
		async LOGIN({ commit }, data) {
			const response = await loginUser(data);
			if (response.data != '') {
				console.log(response.data.nickname);
				console.log('end');
				// commit('SET_USER', response.data.user);
				//commit('SET_TOKEN', response.data.token);
				commit('SET_USER', response.data);
				commit('SET_TOKEN', response.data.nickname);
				saveUserToCookie(response.data.nickname);
				saveAuthToCookie(response.data.nickname);
				return response;
			} else {
				return response;
			}
		},
	},
});
