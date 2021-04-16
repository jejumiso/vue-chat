<template>
	<div class="contents">
		<div class="form-wrapper form-wrapper-sm">
			<PageHeader>회원가입</PageHeader>
			<form @submit.prevent="registerUser" class="form">
				<!-- <div>
					<label for="username">ID</label>
					<input type="text" id="username" v-model="username" :class="usernameValidClass" />
					<p class="validation-text">
						<span class="warning" v-if="!isUsernameValid">
							Please enter an email address
						</span>
					</p>
				</div> -->
				<div>
					<label for="nickname">닉네임 (id로 이용 됩니다.)</label>
					<input type="text" id="nickname" v-model="nickname" :class="nicknameValidClass" />
					<p class="validation-text">
						<span class="warning" v-if="!isUsernameValid">
							4자 이상 입력 하여 주세요.
						</span>
					</p>
				</div>
				<div>
					<label for="password">비밀번호</label>
					<input type="password" id="password" v-model="password" :class="passwordValidClass" />
					<p class="validation-text">
						<span class="warning" v-if="!isPasswordValid">
							8자 이상 입력 하여 주세요.
						</span>
					</p>
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
import { validateNickname, validatePassword } from '@/utils/validation';
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
			if (!this.nickname) {
				return;
			}
			return validateNickname(this.nickname) ? 'valid' : 'invalid';
		},
		isUsernameValid() {
			if (!this.nickname) {
				return true;
			}
			return validateNickname(this.nickname);
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
			return !this.password || !this.nickname || !validateNickname(this.nickname) || !validatePassword(this.password) ? 'disabled' : null;
		},
	},
	methods: {
		async registerUser() {
			try {
				this.logMessage = '';
				const response = await signupUser({
					teamName: this.$store.state.teamName,
					password: this.password,
					nickname: this.nickname,
				});
				if (response.data.error === '' || response.data.error === null) {
					this.logMessage = '가입이 완료 되었습니다.';
					this.initForm();
				} else {
					this.logMessage = `${response.data.error}`;
				}
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
