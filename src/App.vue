<template>
	<div class="app">
		<div style="width:1200px;">
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

export default {
	data() {
		return {};
	},
	components: {
		AppHeader,
		ToastPopup,
		AppFooter,
	},
};
</script>

<style>
@import './assets/css/reset.css';
@import './assets/css/common.css';
</style>
