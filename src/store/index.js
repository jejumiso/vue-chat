import Vue from 'vue';
import Vuex from 'vuex';
import { loginUser } from '@/api/auth';
import { saveAuthToCookie, saveUserToCookie, getUserFromCookie, deleteCookie } from '@/utils/cookies.js';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		teamName: 'teamA', //절대 변하지 않는값.
		nickname: getUserFromCookie() || '',
		//user: {},
		token: '',
		toNickname: '',

		// toState: '', //부재중/통화가능/통화중/OFF/통화일시정지중
		// toIs: '', // ture,false : 통화가능 여부
		// fromID: '',
		// refresh: false,
		// content_width: 0,
		isModalViewChat: false,
		isModalViewed: false,
		channel_id: '',
		roomid: 'roomid',
		messageid: '',
		remonCall: '',
		config: {
			credential: {
				serviceId: '08bf9373-ad2a-4a51-8475-f7274586fd09',
				key: '72f46995bc1a38ced48772b85d5dd4e16929a9785db8f3656f6e083ca2a4ffae',
			},
			view: {
				local: '#localVideo',
				remote: '#remoteVideo',
			},
			media: {
				audio: true,
				video: true,
			},
		},
		listener: '',
		loginOnOffRef: '',
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
			state.nickname = user.nickname;
			// console.log('state.SET_USER : ');
		},
		SET_TOKEN(state, token) {
			state.token = token;
		},
		LOGOUT(state) {
			// state.user = null;
			state.nickname = '';
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
				// console.log('store.LOGIN : ' + response.data.nickame);
				commit('SET_USER', response.data); //$store저장
				commit('SET_TOKEN', response.data.nickname); //$store저장
				saveUserToCookie(response.data.nickname);
				saveAuthToCookie(response.data.nickname);
				return response;
			} else {
				return response;
			}
		},
	},
});
