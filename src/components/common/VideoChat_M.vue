<template>
	<div>
		<div v-if="this.is_Mobile" id="remon_container" style="position:relative;width:100vw;height:100vh;max-width:1100px;margin:0 auto">
			<video id="remoteVideo" style="background-color:#515151;position:absolute;top:0;left:0;width:100%;height:100%" autoplay></video>
			<video id="localVideo" autoplay muted style="background-color:#000;width:30vw;height:22vw;position:absolute;top:1vh;right:5vw"></video>
			<div style="text-align:center;position:absolute;bottom:5vh;width:100%">
				<button @click="remon_click" v-if="remon_vue">접속하기</button>
				<button @click="remon_unclick" v-else>접속종료</button>
			</div>
		</div>
		<div v-else id="remon_container" style="position:relative;width:100%;height:100vh;max-width:1200px;margin:0 auto">
			<video id="remoteVideo" style="background-color:#515151;position:absolute;top:0;left:0;width:100%;height:100%" autoplay></video>
			<video id="localVideo" autoplay muted style="background-color:#000;width:200px;height:120px;position:absolute;top:1vh;right:5vw"></video>
			<div style="text-align:center;position:absolute;bottom:5vh;width:100%">
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
			is_Mobile: false,
		};
	},

	mounted() {
		this.remon_container_height = document.body.outerHeight; // 머예쓴거지?
		this.is_Mobile = this.isMobile(); //모바일 , pc 화면 구분
		this.remon_click();
	},

	methods: {
		isMobile() {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		},
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
		},
		remon_unclick() {
			this.remon_vue = true;
			console.log('레몬 종료 클릭 ');
			remonCall.close();
			this.$store.state.videoChat = false;
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
