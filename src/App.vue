<template>
	<div class="app">
		<VideoChat_M v-if="this.$store.state.videoChat"></VideoChat_M>

		<div id="content" v-else style="width:100%;max-width:1200px;margin:0 auto">
			<AppHeader></AppHeader>
			<div class="app-contents">
				<router-view></router-view>
			</div>
			<AppFooter></AppFooter>
			<ToastPopup></ToastPopup>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppHeader from './components/common/AppHeader.vue';
import VideoChat_M from './components/common/VideoChat_M.vue';
import AppFooter from './components/common/AppFooter.vue';
import ToastPopup from './components/common/ToastPopup.vue';
import bus from '@/utils/bus.js';
// import bus from '@/utils/bus.js';

//this.$store.state.videoChat

export default {
	computed: {
		...mapGetters(['isLoggedIn']),
	},
	data() {
		return {};
	},
	components: {
		VideoChat_M,
		AppHeader,
		ToastPopup,
		AppFooter,
	},
	methods: {
		//로그아웃이나 창을 끌 경우 오프라인 처리..
		OnandOff() {
			var my_nickname = this.$store.state.nickname;
			var starCountRef = this.$firebase
				.database()
				.ref()
				.child('users/' + my_nickname);
			starCountRef.update({
				onlineState: true,
				status: 'online',
			});
			starCountRef.onDisconnect().update({
				onlineState: false,
				status: 'offline',
			});
		},
		//전화요청이 들어 오는것에 대해서...
		OnCall() {
			var my_nickname = this.$store.state.nickname;
			console.log('app.vue nickname : ' + my_nickname);
			var starCountRef = this.$firebase
				.database()
				.ref()
				.child('users/' + my_nickname + '/rooms');

			starCountRef.on('value', snapshot => {
				console.log('value') + snapshot.key;
			});

			starCountRef.on('child_added', data => {
				console.log(data.val().disabled + '____this.$store.state.nickname_____' + this.$store.state.nickname);
				if (data.val().lastUpdateMember !== this.$store.state.nickname) {
					if (data.val().disabled === false) {
						bus.$emit('show:toast_oncall', data.val().nickname, '요청이 들어왔습니다.', 20000, true);
					} else {
						bus.$emit('show:toast_oncall', data.val().nickname, '요청이 취소되었습니다.', 1000, false);
					}
				}
			});
			starCountRef.on('child_changed', data => {
				if (data.val().lastUpdateMember !== this.$store.state.nickname) {
					console.log('data.val().disabled' + data.val().disabled);
					if (data.val().disabled === false) {
						bus.$emit('show:toast_oncall', data.val().nickname, '요청이 들어왔습니다.', 20000, true);
					} else {
						bus.$emit('show:toast_oncall', data.val().nickname, '요청이 취소되었습니다.', 1000, false);
					}
				}
			});
			starCountRef.on('child_removed', data => {
				if (data.val().lastUpdateMember !== this.$store.state.nickname) {
					bus.$emit('show:toast_oncall', data.val().nickname, '요청이 취소되었습니다.', 1000, false);
				}
			});
		},
	},
	mounted() {
		if (this.isLoggedIn) {
			console.log('로그인되었네요..');
			this.OnCall();
			this.OnandOff();
		} else {
			console.log('로그아웃상태입니다.');
		}
	},
};
</script>

<style>
@import './assets/css/reset.css';
@import './assets/css/common.css';
</style>
