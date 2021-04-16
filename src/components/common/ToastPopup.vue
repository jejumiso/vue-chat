<template>
	<div>
		<div class="toast" :class="toastAnimationClass">
			{{ message }}
		</div>
		<div class="toast_oncall" :class="toastAnimationClass_Oncall">
			<div v-if="iscall">{{ message }}<button @click="taketheCall">수락</button></div>
			<div v-else>{{ message }}</div>
			<div style="margin:20px 0 0 0 ">전화요청리스트 보기</div>
		</div>
	</div>
</template>

<script>
import bus from '@/utils/bus.js';

let toastTimer;

export default {
	data() {
		return {
			open: false,
			open_oncall: false,
			iscall: false,
			message: '',
		};
	},
	computed: {
		toastAnimationClass() {
			return this.open ? 'show' : null;
		},
		toastAnimationClass_Oncall() {
			return this.open_oncall ? 'show' : null;
		},
	},
	methods: {
		taketheCall() {
			this.$store.state.isModalViewChat = true;
			this.remon_click();
		},
		remon_click() {
			var _roomid = this.$store.state.roomid;
			var _messageid = this.$store.state.messageid;
			console.log('666666666. this.$firebase : ' + this.$firebase);
			var _firebase = this.$firebase;
			var messagei3d = _firebase
				.database()
				.ref()
				.child('chat_messages/' + _roomid + '/' + _messageid);
			const listener = {
				async onConnect(channelId) {
					// myChannelId = channelId;
					console.log('2. remon onConnect');
					console.log('2. remon onConnect' + channelId);
					console.log('2. remon onConnect' + _roomid);
					console.log('2. remon onConnect' + _messageid);
					// this.remon_onConnect(_roomid, _messageid);

					await messagei3d.update({
						isReceiver: true,
						isCaller: false,
						str_sdate: 'onConnect',
						str_edate: 'onConnect',
					});

					messagei3d.onDisconnect().update({
						str_sdate: 'onDisconnect',
						str_edate: 'onDisconnect',
					});
				},
				onComplete() {
					// Do something
					console.log('3. remon onComplete');
				},
				async onClose() {
					console.log('4. remon onClose');
					await _firebase
						.database()
						.ref()
						.child('chat_messages/' + _roomid + '/' + _messageid)
						.update({
							isReceiver: true,
							isCaller: false,
							str_sdate: 'onClose',
							str_edate: 'onClose',
						});
				},
			};
			const config = this.$store.state.config;
			// eslint-disable-next-line no-undef
			this.$store.state.remonCall = new Remon({ listener, config });

			//caller.listener.onConnect(this.$store.state.channel_i);
			this.$store.state.remonCall.connectCall(this.$store.state.channel_id);
			console.log('9. this.$store.state.remonCall : ' + this.$store.state.remonCall);
		},
		async remon_onConnect(roomid, messageid) {
			console.log('77777777777. roomid, messageid : ' + roomid);
			await this.$firebase
				.database()
				.ref()
				.child('chat_messages/' + roomid + '/' + messageid)
				.update({
					isReceiver: true,
					isCaller: false,
					str_sdate: 'onConnect',
					str_edate: 'onConnect',
				});
		},
		showToast(message) {
			this.message = message;
			this.open = true;
			clearTimeout(toastTimer);
			toastTimer = setTimeout(this.hideToast, 2000);
		},
		toast_oncall(from_nickname, message, clearTimeout, iscall) {
			this.message = message;
			this.iscall = iscall;
			this.open_oncall = true;
			toastTimer = setTimeout(this.hideToast_oncall, clearTimeout);
		},
		hideToast() {
			this.open = false;
		},
		hideToast_oncall() {
			this.open_oncall = false;
		},
	},
	created() {
		bus.$on('show:toast', this.showToast);
		bus.$on('show:toast_oncall', this.toast_oncall);
	},
	beforeDestroy() {
		bus.$off('show:toast', this.showToast);
		bus.$off('show:toast_oncall', this.showToast);
	},
};
</script>

<style scoped>
.toast {
	position: fixed;
	width: 400px;
	height: 56px;
	background-color: #22252e;
	border-radius: 2px;
	box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.2);
	color: white;
	bottom: -120px;
	margin-left: -200px;
	left: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: transform 750ms ease-out;
}
.toast.show {
	transform: translateY(-150px);
	transition: transform 500ms ease-in-out;
}
.toast_oncall {
	padding: 20px;
	position: fixed;
	width: 400px;
	height: 256px;
	background-color: #22252e;
	border-radius: 5%;
	box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.2);
	color: white;
	bottom: -300px;
	/* -120px; */
	margin-left: -200px;
	left: 50%;
	display: block;
	justify-content: center;
	align-items: center;
	transition: transform 750ms ease-out;
}
.toast_oncall.show {
	transform: translateY(-300px);
	transition: transform 500ms ease-in-out;
}
</style>
