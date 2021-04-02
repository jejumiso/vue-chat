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
		async submitForm() {
			if (!this.nickname || !this.password) {
				alert('Fill in the account information');
				return;
			}
			try {
				const response = await this.$store.dispatch('LOGIN', {
					nickname: this.nickname,
					password: this.password,
				});
				if (response.data !== '') {
					console.log(response);
					console.log('LoginFrom - response : ' + response);
					bus.$emit('show:toast', response.data.nickname + ' 로그인 되었습니다.');
					//채팅 데이터에 등록
					this.$firebase
						.database()
						.ref()
						.child('users')
						.child(this.nickname)
						.set({
							state: '로그인',
							onclall: true,
							alram: true,
						});
					this.$router.push('/main2');
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
