<template>
	<div class="contents">
		<div class="form-wrapper form-wrapper-sm">
			<PageHeader>Login</PageHeader>
			<form @submit.prevent="submitForm" class="form">
				<div>
					<label for="nickname">ID</label>
					<input type="text" id="nickname" v-model="nickname" />
				</div>
				<div>
					<label for="password">PW</label>
					<input type="password" id="password" v-model="password" />
				</div>
				<button class="btn">login</button>
			</form>
			<div style="margin:10px 0">
				<button
					class="btn"
					@click="
						nickname = 'bj_1';
						password = '1234';
					"
				>
					bj
				</button>
				&nbsp;
				<button
					class="btn"
					@click="
						nickname = 'member_1';
						password = '1234';
					"
				>
					member
				</button>
			</div>
			<p class="log">
				{{ logMessage }}
			</p>
		</div>
	</div>
</template>

<script>
import bus from '@/utils/bus.js';
import PageHeader from './common/PageHeader.vue';

export default {
	components: {
		PageHeader,
	},
	data() {
		return {
			username: '',
			nickname: '',
			password: '',
			logMessage: '',
		};
	},
	methods: {
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
				console.log('2222. ' + this.$store.state.nickname);
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
		//로그아웃이나 창을 끌 경우 오프라인 처리..
		//로그아웃은 따로 처리할것임..
		//창을 그냥 꺼버릴때 처리 되는 기능이라고 보면 됨(혹은 새로고침)
		OnandOff() {
			let _nickname = this.$store.state.nickname;
			let _firebase = this.$firebase;
			this.$store.state.loginOnOffRef = _firebase
				.database()
				.ref()
				.child('users/' + _nickname);
			this.$store.state.loginOnOffRef.update({
				onlineState: true,
				status: 'online',
			});

			this.$store.state.loginOnOffRef.onDisconnect().update({
				onlineState: false,
				status: 'offline',
			});
		},
		async submitForm() {
			if (!this.nickname || !this.password) {
				alert('로그인 정보를 입력해 주세요.');
				return;
			}
			try {
				const response = await this.$store.dispatch('LOGIN', {
					nickname: this.nickname,
					password: this.password,
				});
				if (response.data !== '') {
					// console.log('LoginFrom - response : ' + response);

					//채팅 데이터에 등록
					// this.$firebase
					// 	.database()
					// 	.ref()
					// 	.child('users')
					// 	.child(this.nickname)
					// 	.update({
					// 		// alram: true,
					// 		onlineState: true,
					// 		status: 'online',
					// 	});

					this.OnandOff();
					this.OnCall();
					bus.$emit('show:toast', response.data.nickname + ' 로그인 되었습니다.');
					this.$router.push('/');
					this.initForm();
				} else {
					bus.$emit('show:toast', '등록된 사용자가 없습니다.');
				}
			} catch (error) {
				console.log('에러 : ' + error);
				this.logMessage = error.response.data;
			}
		},
		initForm() {
			this.username = '';
			this.password = '';
		},
	},
};
</script>

<style scoped>
.btn {
	color: white;
}
</style>
