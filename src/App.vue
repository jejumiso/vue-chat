<template>
	<div class="app">
		<div id="content" style="width:100%;max-width:1200px;min-width:600px;margin:0 auto">
			<AppHeader></AppHeader>
			<div class="app-contents">
				<router-view></router-view>
			</div>
			<AppFooter></AppFooter>
			<ToastPopup></ToastPopup>
		</div>
	</div>
</template>

<script>
import AppHeader from './components/common/AppHeader.vue';
import AppFooter from './components/common/AppFooter.vue';
import ToastPopup from './components/common/ToastPopup.vue';

import bus from '@/utils/bus.js';

export default {
	data() {
		return {};
	},
	components: {
		AppHeader,
		ToastPopup,
		AppFooter,
	},
	methods: {
		ModalPopup() {
			bus.$emit('show:toast', '전화 요청이 있습니다.');
			var my_nickname = this.$store.state.nickname;
			console.log('app.vue nickname : ' + my_nickname);
			var starCountRef = this.$firebase
				.database()
				.ref()
				.child('users/' + my_nickname + '/calllist');
			var int = 0;
			starCountRef.on('value', snapshot => {
				const data = snapshot.val();
				console.log('전화요청?? : ' + data);

				if (int > 0 && data) {
					bus.$emit('show:toast', '진짜 전화 요청이 있습니다.');
				} else {
					bus.$emit('show:toast', '없어용' + int);
				}
				int = int + 1;
			});
		},
	},
	mounted() {
		this.ModalPopup();
	},
};
</script>

<style>
@import './assets/css/reset.css';
@import './assets/css/common.css';
</style>
