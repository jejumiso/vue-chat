<template>
	<div class="container">
		<VueTinySlider v-bind="tinySliderOptions" v-if="BjRakingList">
			<div style="width:5px;padding:0;margin:0"></div>
			<div v-for="(item, index) in BjRakingList" :key="item.memberId" v-bind:style="{ height: bj_height + 'px' }">
				<!-- {{ item.photo_title }} -->
				<div style="height:100%;padding:0 5px;position: relative;" @click="ModalPopup(item.nickname)">
					<span style="position: absolute;bottom:5%;left:8%;font-weight:bold;color:white;font-size:1em;background-color: rgba( 5, 11, 11, 0.05 );">{{ index + 1 }}위<br />{{ item.nickname }}</span>
					<img :src="item.photo_title" style="width:100%;height:100%;object-fit:cover;border-radius: 8%;" />
				</div>
			</div>
		</VueTinySlider>
		<ModalView v-if="isModalViewed" @close-modal="closemodel">
			{{ this.$store.toId }}
			<button @click="call($store.toId)" :disabled="willcall">연결하기</button>
			<div v-if="willcall">
				<div>연결대기중입니다.</div>
				<button @click="cancel_call($store.toId)">취소</button>
			</div>
		</ModalView>
	</div>
</template>

<script>
import { fetchBjRakingForMain } from '@/api/get.js';
import bus from '@/utils/bus.js';
import ModalView from '@/components/common/Modal';

import VueTinySlider from 'vue-tiny-slider';
import VueHead from 'vue-head';
import Vue from 'vue';
Vue.use(VueHead);
export default {
	head() {
		//https://negabaro.github.io/archive/how-to-set-head-in-vue-spa
		return { link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.1/tiny-slider.css' }] };
	},
	components: { VueTinySlider, ModalView },
	data() {
		return {
			tinySliderOptions: {
				mouseDrag: true,
				loop: false,
				items: 6,
				swipeAngle: 45,
				nav: false, //네비 없애기
				controls: false, //컨트롤(앞으로,뒤로) 없애기
				gutter: 25, //슬라이드 사이의 공간(px)
			},
			BjRakingList: null,
			bj_height: 0,
			isModalViewed: false,
			willcall: false,
			keyvalue: '',
		};
	},
	methods: {
		closemodel() {
			console.log('$store.toId');
			this.cancel_call(this.$store.toId);
			this.isModalViewed = false;
		},
		calwidth() {
			var element = document.getElementById('content');
			var w = element.clientWidth;
			if (w === 1200) {
				this.bj_height = 250;
			} else {
				this.bj_height = w / 6;
			}
		},
		async fetchBjRakingForMain() {
			try {
				const {
					data: { content: BjRaking },
				} = await fetchBjRakingForMain();

				this.BjRakingList = BjRaking;
				// console.log(this.BjRakingList);
				this.calwidth();
				return;
			} catch (error) {
				console.log(error);
			}
		},
		call(nickname) {
			console.log('call : ' + nickname);
			var _key = this.$firebase
				.database()
				.ref()
				.child('users')
				.child(nickname)
				.child('rooms')
				.push().key;

			this.$firebase
				.database()
				.ref()
				.child('users')
				.child(nickname)
				.child('rooms')
				.child(_key)
				.set({
					to: nickname,
					from: this.$store.state.nickname,
					roomid: '',
					disabled: false,
					state: '요청이들어왔습니다.',
				});
			// this.$firebase
			// 	.database()
			// 	.ref()
			// 	.child('users')
			// 	.child(nickname)
			// 	.child('rooms')
			// 	.child(_key)
			// 	.OnDisconnect()
			// 	.remove();
			this.$firebase
				.database()
				.ref()
				.child('users')
				.child(this.$store.state.nickname)
				.child('rooms')
				.child(_key)
				.set({
					to: nickname,
					from: this.$store.state.nickname,
					disabled: false,
					roomid: '',
					state: '요청이하였습니다.',
				});
			// this.$firebase
			// 	.database()
			// 	.ref()
			// 	.child('users')
			// 	.child(this.$store.state.nickname)
			// 	.child('rooms')
			// 	.child(_key)
			// 	.OnDisconnect()
			// 	.remove();

			console.log('생선된 키값 3: ' + _key);
			this.keyvalue = _key;
			this.willcall = true;
		},
		cancel_call(nickname) {
			this.$firebase
				.database()
				.ref()
				.child('users')
				.child(nickname)
				.child('rooms/' + this.keyvalue)
				.remove();
			this.$firebase
				.database()
				.ref()
				.child('users')
				.child(this.$store.state.nickname)
				.child('rooms/' + this.keyvalue)
				.remove();
			this.willcall = false;
		},
		async ModalPopup(nickname) {
			//초기화
			this.willcall = false;

			//[1] 상대방이 통화중이거나 부재중인지 확인.
			//[1-1] 채팅 리스트에 없으면 offline
			//[1-1] 채팅 리스트에 있으면 online  통화중인지..수신거부중인지 등 확이
			console.log('starCountRef nickname : ' + nickname);
			var starCountRef = this.$firebase
				.database()
				.ref()
				.child('users')
				.child(nickname);

			var is = false;

			await starCountRef
				.get()
				.then(function(snapshot) {
					if (snapshot.exists()) {
						const data = snapshot.val();

						if (!data) {
							bus.$emit('show:toast', nickname + '님은 offline입니다.');
						} else {
							if (data.onlineState) {
								is = true;
							} else {
								is = false;
								bus.$emit('show:toast', nickname + '님은' + data.status);
							}
						}
					} else {
						console.log('No data available');
					}
				})
				.catch(function(error) {
					console.error('error             1234   :      ' + error);
				});
			this.isModalViewed = is;
			console.log('this.isModalViewed = is ~~~~~~~~: ' + this.isModalViewed);
			this.$store.toId = nickname;
			// //실시간이 아닌 한번 읽기로 바꿔야함...
			// starCountRef.on('value', snapshot => {
			// 	const data = snapshot.val();
			// 	console.log('starCountRef : ' + data);
			// 	if (!data) {
			// 		bus.$emit('show:toast', nickname + '님은 offline입니다.');
			// 		starCountRef.off();
			// 	} else {
			// 		toIs = data.onclall;
			// 		if (toIs) {
			// 			console.log(nickname + ' 팝업창 뛰우기');
			// 			this.isModalViewed = true;
			// 			this.$store.toId = nickname;
			// 			starCountRef.off();
			// 		} else {
			// 			this.isModalViewed = false;
			// 			bus.$emit('show:toast', nickname + '님은' + data.state);
			// 			starCountRef.off();
			// 		}
			// 	}
			// });
		},
	},
	created() {
		this.fetchBjRakingForMain();
	},
	mounted() {
		this.calwidth();
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
#tns1 > .tns-item {
	padding: 0;
}
.tns-item {
	/* font-size: 3rem;
	font-family: Arial;
	text-align: center; */
	/* padding: 2em; */
	/* background: #fafafb; */
}
.tns-item:nth-child(odd) {
	/* background: #c8e1ff; */
}
</style>
