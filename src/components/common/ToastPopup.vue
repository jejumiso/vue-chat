<template>
	<div>
		<div class="toast" :class="toastAnimationClass">
			{{ message }}
		</div>
		<div class="toast_oncall" :class="toastAnimationClass_Oncall">
			<div>{{ message }}<button>수락</button></div>
			<br />
			<div>전화요청리스트 보기</div>
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
		showToast(message) {
			this.message = message;
			this.open = true;
			clearTimeout(toastTimer);
			toastTimer = setTimeout(this.hideToast, 2000);
		},
		toast_oncall(from_nickname, message) {
			this.message = message;
			this.open_oncall = true;
			clearTimeout(toastTimer);
			toastTimer = setTimeout(this.hideToast_oncall, 20000);
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
	position: fixed;
	width: 400px;
	height: 256px;
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
.toast_oncall.show {
	transform: translateY(-150px);
	transition: transform 500ms ease-in-out;
}
</style>
