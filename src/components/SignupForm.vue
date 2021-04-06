<template>
	<div class="contents">
		<div class="form-wrapper form-wrapper-sm">
			<PageHeader>회원가입</PageHeader>
			<form @submit.prevent="registerUser" class="form">
				<div>
					<label for="username">ID</label>
					<input type="text" id="username" v-model="username" :class="usernameValidClass" />
					<p class="validation-text">
						<span class="warning" v-if="!isUsernameValid">
							Please enter an email address
						</span>
					</p>
				</div>
				<div>
					<label for="password">PW</label>
					<input type="password" id="password" v-model="password" :class="passwordValidClass" />
					<p class="validation-text">
						<span class="warning" v-if="!isPasswordValid">
							Password must be over 8 letters
						</span>
					</p>
				</div>
				<div>
					<label for="nickname">Nickname</label>
					<input type="text" id="nickname" v-model="nickname" :class="nicknameValidClass" />
				</div>
				<button type="submit" class="btn" :class="isButtonDisabled" :disabled="isButtonDisabled">
					가입
				</button>
			</form>
			<p class="log">
				{{ logMessage }}
			</p>
		</div>
		<div>
			<button
				class="btn"
				@click="
					username = 'a@a.com';
					password = '12345678';
					nickname = 'bj_12341234';
				"
			>
				bj
			</button>
			<button
				class="btn"
				@click="
					username = 'member@a.com';
					password = '12345678';
					nickname = 'member_12341234';
				"
			>
				mem
			</button>
		</div>
	</div>
</template>

<script>
import { signupUser } from '@/api/auth';
import { validateEmail, validatePassword } from '@/utils/validation';
import PageHeader from './common/PageHeader.vue';

export default {
	components: {
		PageHeader,
	},
	data() {
		return {
			username: '',
			password: '',
			nickname: '',
			logMessage: '',
		};
	},
	computed: {
		usernameValidClass() {
			if (!this.username) {
				return;
			}
			return validateEmail(this.username) ? 'valid' : 'invalid';
		},
		isUsernameValid() {
			if (!this.username) {
				return true;
			}
			return validateEmail(this.username);
		},
		passwordValidClass() {
			if (!this.password) {
				return;
			}
			return validatePassword(this.password) ? 'valid' : 'invalid';
		},
		isPasswordValid() {
			if (!this.password) {
				return true;
			}
			return validatePassword(this.password);
		},
		nicknameValidClass() {
			return this.nickname ? 'valid' : null;
		},
		isButtonDisabled() {
			return !this.username || !this.password || !this.nickname || !validateEmail(this.username) || !validatePassword(this.password) ? 'disabled' : null;
		},
	},
	methods: {
		async registerUser() {
			try {
				await signupUser({
					teamName: this.$store.state.teamName,
					password: this.password,
					nickname: this.nickname,
				});
				this.logMessage = '가입이 완료 되었습니다.';
				this.initForm();
			} catch (error) {
				console.log(error.response);
				if (error.response.status === 409) {
					this.logMessage = `${this.username} already exists`;
				}
			}
		},
		initForm() {
			this.username = '';
			this.password = '';
			this.nickname = '';
		},
	},
};
</script>

<style scoped>
.form {
	width: 460px;
	height: 100%;
}
.form .validation-text {
	margin-top: -0.5rem;
	margin-bottom: 0.5rem;
	font-size: 1rem;
	display: flex;
	flex-direction: row-reverse;
	justify-content: space-between;
}
.btn {
	color: white;
}
.log {
	width: 460px;
}
</style>
