<template>
	<div class="container">
		<vue-tiny-slider v-bind="tinySliderOptions">
			<div style="width:1px;padding:0;margin:0"></div>
			<div>#1</div>
			<div>#2</div>
			<div>#3</div>
			<div>#4</div>
			<div>#5</div>
			<div>#6</div>
			<div>#7</div>
			<div>#8</div>
			<div>#9</div>
			<div>#10</div>
			<div>#11</div>
			<div>#12</div>
			<div>#13</div>
			<div>#14</div>
			<div>#15</div>
			<div>#16</div>
			<div>#17</div>
			<div>#18</div>
			<div>#19</div>
			<div>#20</div>
			<div>#21</div>
		</vue-tiny-slider>
	</div>
</template>

<script>
import VueTinySlider from 'vue-tiny-slider';
import VueHead from 'vue-head';
import Vue from 'vue';
Vue.use(VueHead);
export default {
	head() {
		//https://negabaro.github.io/archive/how-to-set-head-in-vue-spa
		return {
			link: [
				{
					rel: 'stylesheet',
					href:
						'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.1/tiny-slider.css',
				},
			],
		};
	},
	components: { 'vue-tiny-slider': VueTinySlider },
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
		};
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
	padding: 2em;
	background: #fafafb;
}
.tns-item:nth-child(odd) {
	background: #c8e1ff;
}
</style>
