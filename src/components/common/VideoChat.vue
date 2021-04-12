<template>
	<div>
		pc용
		<div id="remon_container" style="position:relative;" v-bind:style="{ height: remon_container_height + 'px' }">
			<video id="remoteVideo" style="width:100%;height:300px;background-color:#333;position:absolute;top:0;left:0" autoplay></video>
			<video id="localVideo" autoplay muted style="width:150px;height:150px;background-color:#000;position:absolute;bottom:10px;right:10px;"></video>
			<div style="text-align:center;position:absolute;width:100%;bottom:5px;">
				<button @click="remon_click" v-if="remon_vue">접속하기</button>
				<button @click="remon_unclick" v-else>접속종료</button>
			</div>
		</div>
	</div>
</template>

<script>
import VueHead from 'vue-head';
import Vue from 'vue';
Vue.use(VueHead);
const config = {
	credential: {
		serviceId: '08bf9373-ad2a-4a51-8475-f7274586fd09',
		key: '72f46995bc1a38ced48772b85d5dd4e16929a9785db8f3656f6e083ca2a4ffae',
	},
	view: {
		local: '#localVideo',
		remote: '#remoteVideo',
	},
};
// const remonCall = new Remon({ config });
var remonCall = '';
export default {
	data() {
		return {
			remon_vue: true,
			remon_container_height: 0,
		};
	},

	mounted() {
		// let recaptchaScript = document.createElement('script');
		// recaptchaScript.setAttribute('src', 'https://webrtc.github.io/adapter/adapter-latest.js');
		// document.head.appendChild(recaptchaScript);
		// let recaptchaScript2 = document.createElement('script');
		// recaptchaScript2.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@remotemonster/sdk/remon.min.js');
		// document.head.appendChild(recaptchaScript2);
		// console.log('mounted _ remonCall : ' + remonCall);
		// this.cal_height_remon();

		//document.body.outerWidth;
		this.remon_container_height = document.body.outerHeight;
		console.log('document.body.outerHeight   :  ' + document.body.outerHeight);
	},

	methods: {
		cal_height_remon() {
			var element = document.getElementById('content');
			var w = element.clientWidth;
			this.remon_container_height = (w / 4) * 3;
		},
		remon_click() {
			if (remonCall === '') {
				console.log('레몬클릭 remonCall : ' + remonCall);
				remonCall = new Remon({ config });
			}

			this.remon_vue = false;

			remonCall.connectCall('CHANNEL_ID');
			remonCall.onClose({});
		},
		remon_unclick() {
			this.remon_vue = true;
			console.log('레몬 종료 클릭 ');
			remonCall.close();
		},
		remon() {
			console.log('레몬');
			this.remonCall.connectCall('CHANNEL_ID');
		},
	},

	created() {
		var scripts = ['https://webrtc.github.io/adapter/adapter-latest.js', 'https://cdn.jsdelivr.net/npm/@remotemonster/sdk/remon.min.js'];
		scripts.forEach(script => {
			let tag = document.createElement('script');
			tag.setAttribute('src', script);
			document.head.appendChild(tag);
		});
	},
};
</script>

<style>
header {
	display: none;
}
</style>
