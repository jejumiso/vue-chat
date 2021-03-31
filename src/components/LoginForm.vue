<template>
	<div class="contents">
		<div class="form-wrapper form-wrapper-sm">
			<PageHeader>Login</PageHeader>
			<form @submit.prevent="submitForm" class="form">
				<div>
					<label for="username">ID</label>
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
	},
};
</script>

<style scoped>
.btn {
	color: white;
}
</style>
