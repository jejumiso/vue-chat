<template>
	<div class="app">
		<VideoChat_M v-if="this.$store.state.isModalViewChat"></VideoChat_M>
		<div id="content" v-else style="width:100%;max-width:1200px;margin:0 auto;background-color: white;min-height:100%;">
			<AppHeader></AppHeader>
			<div class="app-contents">
				<transition name="fade">
					<router-view></router-view>
				</transition>
			</div>
			<AppFooter></AppFooter>
			<ToastPopup></ToastPopup>
		</div>
		<ModalTrayChat v-if="$store.state.isModalViewed"></ModalTrayChat>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppHeader from './components/common/AppHeader.vue';
import ModalTrayChat from './components/common/ModalTrayChat.vue';
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
		ModalTrayChat,
		AppHeader,
		ToastPopup,
		AppFooter,
	},
	methods: {
		//로그아웃이나 창을 끌 경우 오프라인 처리..
		OnandOff() {
			let my_nickname = this.$store.state.nickname;
			let _firebase = this.$firebase;
			this.$store.state.loginOnOffRef = _firebase
				.database()
				.ref()
				.child('users/' + my_nickname);
			this.$store.state.loginOnOffRef.update({
				onlineState: true,
				status: 'online',
			});

			this.$store.state.loginOnOffRef.onDisconnect().update({
				onlineState: false,
				status: 'offline',
			});
		},
		//전화요청이 들어 오는것에 대해서...
		OnCall() {
			var _nickname = this.$store.state.nickname;
			console.log('app.vue nickname : ' + _nickname);
			var starCountRef = this.$firebase
				.database()
				.ref()
				.child('users/' + _nickname + '/rooms');

			// starCountRef.on('value', snapshot => {
			// 	console.log('1. oncall value' + snapshot.key);
			// });

			starCountRef.on('child_added', data => {
				if (data.val().lastUpdateMember !== this.$store.state.nickname) {
					// if (data.val().disabled === false) {
					// 	bus.$emit('show:toast_oncall', data.val().nickname, '요청이 들어왔습니다.', 20000, true);
					// 	this.$store.state.roomid = data.val().roomid;
					// 	this.$store.state.channel_id = data.val().lastChannel_id;
					// 	// this.$store.state.messageid = data.val().channel_id;
					// } else {
					// 	bus.$emit('show:toast_oncall', data.val().nickname, '요청이 취소되었습니다.', 1000, false);
					// 	this.$store.state.roomid = '';
					// 	this.$store.state.channel_id = '';
					// }
				}
			});
			starCountRef.on('child_changed', data => {
				if (data.val().lastUpdateMember !== this.$store.state.nickname) {
					console.log('3333.  data.val().disabled' + data.val().disabled);
					if (data.val().disabled === false) {
						bus.$emit('show:toast_oncall', data.val().nickname, '요청이 들어왔습니다.', 20000, true);
						this.$store.state.roomid = data.val().roomid;
						console.log('55555555555 this.$store.state.roomid   : ' + this.$store.state.roomid);
						this.$store.state.channel_id = data.val().lastChannel_id;
						this.$store.state.messageid = data.val().lastmessageid;
					} else {
						bus.$emit('show:toast_oncall', data.val().nickname, '요청이 취소되었습니다.', 1000, false);
						this.$store.state.roomid = '';
						this.$store.state.channel_id = '';
						this.$store.state.messageid = '';
					}
				}
			});
			starCountRef.on('child_removed', data => {
				if (data.val().lastUpdateMember !== this.$store.state.nickname) {
					bus.$emit('show:toast_oncall', data.val().nickname, '요청이 취소되었습니다.', 1000, false);
					this.$store.state.roomid = '';
					this.$store.state.channel_id = '';
					this.$store.state.messageid = '';
				}
			});
		},
	},
	mounted() {
		if (this.isLoggedIn) {
			this.OnCall();
			this.OnandOff(); // 로그인을 하고 새로 고침을 했을 경우 대비....
		}
	},
	updated() {
		// console.log('222222222222222.APP...  updated..');
	},
};
</script>

<style>
@import './assets/css/reset.css';
@import './assets/css/common.css';
.fade-enter-active,
.fade-leave-active {
	transition-property: opacity;
	transition-duration: 0.25s;
}

.fade-enter-active {
	transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
.app {
	background-color: rgba(100, 100, 100, 0);
}
</style>
