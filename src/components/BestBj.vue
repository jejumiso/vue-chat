<template>
	<div class="container">
		<VueTinySlider v-bind="tinySliderOptions" v-if="BjRakingList">
			<div style="width:5px;padding:0;margin:0"></div>
			<div v-for="(item, index) in BjRakingList" :key="item.memberId" v-bind:style="{ height: bj_height + 'px' }">
				<!-- {{ item.photo_title }} -->
				<div style="height:100%;padding:0 5px;position: relative;" @click="RequestChat(item.nickname)">
					<span style="position: absolute;bottom:5%;left:8%;font-weight:bold;color:white;font-size:1em;background-color: rgba( 5, 11, 11, 0.05 );"
						>{{ index + 1 }}위<br />{{ item.nickname }}</span
					>
					<img :src="item.photo_title" style="width:100%;height:100%;object-fit:cover;border-radius: 5%;" />
				</div>
			</div>
		</VueTinySlider>
		<p>버튼을 누르면 모달 대화 상자가 열립니다.</p>
		<button @click="openModal">열기</button>
		<!-- 컴포넌트 MyModal -->
		<MyModal @close="closeModal" v-if="modal">
			<!-- default 슬롯 콘텐츠 -->
			<p>Vue.js Modal Window!</p>
			<div><input v-model="message" /></div>
			<!-- /default -->
			<!-- footer 슬롯 콘텐츠 -->
			<template slot="footer">
				<button @click="doSend">제출</button>
			</template>
			<!-- /footer -->
		</MyModal>
	</div>
</template>

<script>
import MyModal from '@/components/common/Modal.vue';
import { mapGetters } from 'vuex';
import bus from '@/utils/bus.js';
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
	components: { VueTinySlider, MyModal },
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
			//모달
			modal: false,
			message: '',
		};
	},
	methods: {
		RequestChat(nickname) {
			if (this.isLoggedIn) {
				bus.$emit('show:toast', nickname + '에게 요청합니다.');
				//[1] nickname의 상태 확인
			} else {
				bus.$emit('show:toast', '로그인 이후 이용 가능합니다.');
				this.$router.push('/login');
			}
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
			console.log('d');
			try {
				const {
					data: { content: BjRaking },
				} = await fetchBjRakingForMain();

				this.BjRakingList = BjRaking;
				console.log(this.BjRakingList);
				this.calwidth();
				return;
			} catch (error) {
				console.log(error);
			}
		},
		//모달 : https://rintiantta.github.io/jpub-vue/examples/modal.html#%EC%86%8C%EC%8A%A4-%EC%BD%94%EB%93%9C
		openModal() {
			this.modal = true;
		},
		closeModal() {
			this.modal = false;
		},
		doSend() {
			if (this.message.length > 0) {
				alert(this.message);
				this.message = '';
				this.closeModal();
			} else {
				alert('메시지를 입력해주세요.');
			}
		},
	},
	created() {
		this.fetchBjRakingForMain();
	},
	mounted() {
		this.calwidth();
	},
	computed: {
		...mapGetters(['isLoggedIn']),
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
