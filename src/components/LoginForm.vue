<template>
	<div class="contents">
		<div class="form-wrapper form-wrapper-sm">
			<PageHeader>Login</PageHeader>
			<form @submit.prevent="submitForm" class="form">
				<div>
					<label for="username">ID</label>
					<input type="text" id="username" v-model="username" />
				</div>
				<div>
					<label for="password">PW</label>
					<input type="password" id="password" v-model="password" />
				</div>
				<button class="btn">login</button>
			</form>
			<button class="btn" @click="bj_create">bj생성</button>
			<button class="btn" @click="bj_namechange">bj이름 수정</button>
			<button class="btn" @click="read">읽기</button>
			<div>
				<div class="form">
					<label for="username2">member</label>
					<input type="text" id="username2" v-model="username2" />
				</div>
				<button class="btn" @click="member_create">맴버생성</button>
				<button class="btn" @click="member_to_bj_videochatting">채팅요청</button>
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
			username2: '',
			password: '',
			logMessage: '',
			site: {
				menu: [],
				username: '유저',
				title: 'skdㅁㄴㅇㄹ',
				footer: '푸터',
			},
		};
	},
	created() {
		this.subscribe();
	},
	methods: {
		subscribe() {
			console.log('subscribe start');
			//17강
			this.$firebase
				.database()
				.ref()
				.child('site')
				.on(
					'value',
					sn => {
						const v = sn.val();
						if (!v) {
							console.log('없나?');
							this.$firebase
								.database()
								.ref()
								.child('site')
								.set(this.site);
							console.log(v);
							this.username = this.site.username;
							// console.log('없나?');
						} else {
							console.log('있나?');
							this.site = v;
							this.username = this.site.username;
							// console.log('있나?');
						}
					},
					e => {
						console.log('에러' + e.message);
					},
				);
		},

		async submitForm() {
			if (!this.username || !this.password) {
				alert('Fill in the account information');
				return;
			}
			try {
				const response = await this.$store.dispatch('LOGIN', {
					username: this.username,
					password: this.password,
				});
				console.log(response);
				bus.$emit('show:toast', response.data.message);
				this.$router.push('/main');
				this.initForm();
			} catch (error) {
				console.log(error);
				this.logMessage = error.response.data;
			}
		},
		initForm() {
			this.username = '';
			this.password = '';
		},
		bj_create() {
			// console.log('save');
			this.$firebase
				.database()
				.ref('webret')
				.child('bj_user')
				.child('bj_user_01')
				.set({
					username_bj: this.username,
				});
		},
		member_create() {
			console.log('member_create');
			this.$firebase
				.database()
				.ref('webret')
				.child('member_user')
				.child('member_user_01')
				.set({
					username_member: this.username2,
				});
		},
		member_to_bj_videochatting() {
			var bj_check = true;
			console.log('요청');
			if (bj_check) {
				//bj가 영상채팅 수령 가능하면
				console.log(this.username2);
				console.log('요청');
				this.$firebase
					.database()
					.ref('webret')
					.child('bj_user')
					.child('bj_user_01')
					.child('member_to_bj_videochatting')
					.child(this.username2)
					.set({
						username_member: 'ㅁㄴㅇㄹ',
					});
				// this.$firebase
				// 	.database()
				// 	.ref('webret')
				// 	.child('member_user')
				// 	.child('member_user_01')
				// 	.child('member_to_bj_videochatting')
				// 	.set({
				// 		username_bj: this.username,
				// 	});
			}
		},
		bj_namechange() {
			// console.log('save');
			this.$firebase
				.database()
				.ref('webret')
				.child('bj_user')
				.child('bj_user_01')
				.update({
					username: this.username,
				});
		},
		read() {
			// console.log('read');
			// this.$firebase
			// 	.database()
			// 	.ref('webret')
			// 	.child('bj_user_01')
			// 	.on('value', sn => {
			// 		console.log(sn);
			// 		console.log(sn.val());
			// 		this.username = sn.username.val();
			// 	});
		},
	},
};
</script>

<style scoped>
.btn {
	color: white;
}
</style>
