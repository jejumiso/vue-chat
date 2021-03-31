<template>
	<div class="container">
		<VueTinySlider v-bind="tinySliderOptions" v-if="BjRakingList">
			<div style="width:5px;padding:0;margin:0"></div>
			<div v-for="item in BjRakingList" :key="item.memberId">
				<!-- {{ item.photo_title }} -->
				<div style="border-radius: 50%;">
					<img :src="item.photo_title" style="width: 250px;height: 250px;object-fit: fill;" />
				</div>
			</div>
		</VueTinySlider>
	</div>
</template>

<script>
import { fetchBjRakingForMain } from '@/api/get.js';

import VueTinySlider from 'vue-tiny-slider';
import VueHead from 'vue-head';
import Vue from 'vue';
Vue.use(VueHead);
export default {
	head() {
		//https://negabaro.github.io/archive/how-to-set-head-in-vue-spa
		return { link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.1/tiny-slider.css' }] };
	},
	components: { VueTinySlider },
	data() {
		return {
			tinySliderOptions: {
				mouseDrag: true,
				loop: false,
				items: 6,
				swipeAngle: 45,
				nav: false, //네비 없애기
				controls: false, //컨트롤(앞으로,뒤로) 없애기
				gutter: 20, //슬라이드 사이의 공간(px)
			},
			BjRakingList: null,
		};
	},
	methods: {
		async fetchBjRakingForMain() {
			console.log('d');
			try {
				const {
					data: { content: BjRaking },
				} = await fetchBjRakingForMain();

				this.BjRakingList = BjRaking;
				console.log(this.BjRakingList);
				return;
			} catch (error) {
				console.log(error);
			}
		},
	},
	created() {
		this.fetchBjRakingForMain();
	},
};
</script>

<style scoped>
div.container {
	margin: 10px 0;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
.tns-item {
	font-size: 3rem;
	font-family: Arial;
	text-align: center;
	/* padding: 2em; */
	background: #fafafb;
}
.tns-item:nth-child(odd) {
	background: #c8e1ff;
}
</style>
