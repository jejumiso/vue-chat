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
// import bus from '@/utils/bus.js';

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
		OnCall() {
			var my_nickname = this.$store.state.nickname;
			console.log('app.vue nickname : ' + my_nickname);
			var starCountRef = this.$firebase
				.database()
				.ref()
				.child('users/' + my_nickname + '/calllist');
			var int = 0;

			starCountRef.on('value', snapshot => {
				if (int === 0) {
					int = 1;
					console.log('value') + snapshot.key;
				}
			});

			starCountRef.on('child_added', data => {
				if (int > 0) {
					// console.log('child_added JSON.stringify : ' + JSON.stringify(data));
					// console.log('child_added data.nickname : ' + data.val().nickname);
					bus.$emit('show:toast_oncall', data.val().nickname, '요청이 들어왔습니다.');
				} else {
					int = 1;
				}
			});
			starCountRef.on('child_changed', data => {
				console.log('child_changed') + data.key;
			});

			starCountRef.on('child_removed', data => {
				console.log('child_changed') + data.key;
			});
		},
	},
	mounted() {
		this.OnCall();
	},
};
</script>

<style>
@import './assets/css/reset.css';
@import './assets/css/common.css';
</style>
