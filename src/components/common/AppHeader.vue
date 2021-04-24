<template>
	<header id="header" :class="{ fixed: false }" ref="appHeader">
		<div>
			<router-link to="/" class="logo">
				TIL
				<span v-if="isLoggedIn">by {{ this.$store.state.nickname }}</span>
			</router-link>
		</div>
		<div class="navigations">
			<template v-if="!isLoggedIn">
				<router-link to="/login">로그인</router-link>
				<router-link to="/signup">회원가입</router-link>
			</template>
			<template v-else>
				<a href="javascript:;" @click="logout" class="logout-button">Logout</a>
				<a href="javascript:;" @click="showModal = true" class="logout-button">마이페이지</a>
				<Modal2 v-if="showModal" @close="showModal = false">
					<h3 slot="header">마이페이지 <button class="modal-default-button" @click="showModal = false">X</button></h3>
					<div slot="body">
						<h3>정보수정</h3>
						<div><router-link to="/profile">사진정보</router-link></div>
						<h3>지역확인</h3>
						<select
							><option>서울</option
							><option>서울</option></select
						>
					</div>

					<h3 slot="footer"></h3>
				</Modal2>
			</template>
		</div>
	</header>
</template>

<script>
import { mapGetters } from 'vuex';
import bus from '@/utils/bus';
import Modal2 from '@/components/common/Modal2.vue';

export default {
	components: {
		Modal2,
	},
	computed: {
		...mapGetters(['isLoggedIn']),
	},
	data() {
		return {
			navHeight: 0,
			isFixed: false,
			showModal: false,
		};
	},
	watch: {
		$route: 'looseHeader',
	},
	methods: {
		logout() {
			this.$firebase
				.database()
				.ref()
				.child('users')
				.child(this.$store.state.nickname)
				.update({
					onlineState: false,
					status: 'logout',
				});
			// this.$store.state.loginOnOffRef.onDisconnect().cancel();
			this.$store.state.loginOnOffRef = '';

			bus.$emit('show:toast', '로그아웃.');
			this.$store.commit('LOGOUT');
			this.$router.push('/login');
		},
		checkHeight() {
			window.scrollY > 5 ? this.stickHeader() : this.looseHeader();
		},
		stickHeader() {
			this.isFixed = true;
			document.querySelector('.main').classList.add('sticky');
		},
		looseHeader() {
			this.isFixed = false;
			document.querySelector('.main').classList.remove('sticky');
		},
	},
	mounted() {
		if (this.$route.name !== 'main') {
			return;
		}
		this.navHeight = this.$refs.appHeader.offsetHeight;
		window.addEventListener('scroll', this.checkHeight);
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.checkHeight);
	},
};
</script>

<style scoped>
header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 20px;
	/* Use the color you like! */
	/* background-color: #3CA776; */
	/* background-color: #2e3e37; */
	background-color: #927dfc;
	z-index: 2;
	box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);
}
a {
	color: #dedede;
	font-size: 18px;
}
a.logo {
	font-size: 30px;
	font-weight: 900;
	color: white;
}
.logo > span {
	font-size: 14px;
	font-weight: normal;
}
.navigations a {
	margin-left: 10px;
}
.fixed {
	position: fixed;
	top: 0;
	width: 100%;
	max-width: 1200px;
}
.add-button {
	background: #3ca776;
	color: white;
	padding: 4px 23px;
	border-radius: 4px;
}
.logout-button {
	font-size: 14px;
}
a.router-link-exact-active {
	color: white;
	font-weight: bold;
}
</style>
