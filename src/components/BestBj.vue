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
		<!-- <ModalView v-if="isModalViewed" @close-modal="closemodal">
			{{ this.to_nickname }}
			<button @click="video_call(to_nickname)" :disabled="iscalltrying">연결하기</button>
			<div v-if="iscalltrying">
				<div>연결대기중입니다.</div>
				<button @click="cancel_call(to_nickname)">취소</button>
			</div>
		</ModalView> -->
	</div>
</template>

<script>
import { fetchBjRakingForMain } from '@/api/get.js';
import bus from '@/utils/bus.js';
// import ModalView from '@/components/common/Modal';

import VueTinySlider from 'vue-tiny-slider';
import VueHead from 'vue-head';
import Vue from 'vue';
Vue.use(VueHead);
export default {
	head() {
		//https://negabaro.github.io/archive/how-to-set-head-in-vue-spa
		return { link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.1/tiny-slider.css' }] };
	},
	components: {
		VueTinySlider,
		//  ModalView
	},
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
			keyvalue: '',
			// to_nickname: '',
			roomid: '',
		};
	},
	methods: {
		closemodal() {
			console.log('closemodel...');
			if (this.$store.state.toNickname !== '') {
				this.cancel_call();
			}
			this.isModalViewed = false;
		},
		calwidth() {
			var element = document.getElementById('content');
			var w = element.clientWidth;
			console.log(' w w w w w w w w w w w w w w : ' + w);
			if (w === 1200) {
				this.bj_height = 250;
			} else {
				this.tinySliderOptions = {
					mouseDrag: true,
					loop: false,
					items: 4,
					swipeAngle: 45,
					nav: false, //네비 없애기
					controls: false, //컨트롤(앞으로,뒤로) 없애기
					gutter: 25, //슬라이드 사이의 공간(px)
				};
				this.bj_height = w / 4;
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
		async video_call(_toNickname) {
			var roomid = '';
			var _nickname = this.$store.state.nickname;
			// [1] 생성된 방이 있는지 확인한다.
			await this.$firebase
				.database()
				.ref()
				.child('users')
				.child(_nickname)
				.child('rooms')
				.get()
				.then(function(snapshot) {
					if (snapshot.exists()) {
						for (var room in snapshot.val()) {
							if (snapshot.child(room).val().chatMember === _toNickname) {
								roomid = room;
							}
						}
						return snapshot;
					} else {
						console.log('No data available');
					}
				})
				.catch(function(error) {
					console.error(error);
				});

			//[2] 이미 생성된 방이 없으면 방 생성.
			if (roomid === '') {
				roomid = await this.$firebase
					.database()
					.ref()
					.child('users')
					.child(_toNickname)
					.child('rooms')
					.push().key;
				console.log('생성된 방 rooid    => ' + roomid);
				console.log('생성된 방 rooid    => ' + roomid);
			}
			this.roomid = roomid;
			//[3 - 1] chat_message    messageKey
			var messageid = await this.$firebase
				.database()
				.ref()
				.child('chat_messages/' + roomid)
				.push().key;
			//[3 - 2] chat_message
			var message_data = {
				messageid: messageid,
				messageUser: { nickname: _nickname }, //메시지 보낸사람
				msgData: '날짜',
				msgType: 'video_call',
				readUserIds: '',
			};
			//[3 - 3] 메시지 data 입력
			await this.$firebase
				.database()
				.ref()
				.child('chat_messages/' + roomid + '/' + messageid)
				.set(message_data);
			//[4 - 1]  room 정보  user에게 주입
			//[4 - 2]  요청 받는자에게
			await this.$firebase
				.database()
				.ref()
				.child('users')
				.child(_nickname)
				.child('rooms')
				.child(roomid)
				.update({
					chatId: roomid,
					creDate: '생성한날짜',
					disabled: false,
					lastMessage: '마지막메시지',
					title: _toNickname + '으로 부터....',
					chatMember: _toNickname,
					lastUpdateMember: _nickname,
					totalUnreadCount: 0,
				});
			//[4 - 4]  요청자에게...
			await this.$firebase
				.database()
				.ref()
				.child('users')
				.child(_toNickname)
				.child('rooms')
				.child(roomid)
				.update({
					chatId: roomid,
					creDate: '생성한날짜',
					disabled: false,
					lastMessage: '마지막메시지',
					title: _toNickname + '으로 부터....',
					chatMember: _nickname,
					lastUpdateMember: _nickname,
					totalUnreadCount: 0,
				});
			//[5 - 1]  요청 받는자에게
			await this.$firebase
				.database()
				.ref()
				.child('chat_members')
				.child(roomid)
				.child(_toNickname)
				.update({
					nickname: _toNickname,
				});
			//[5 - 1]  요청자에게...
			await this.$firebase
				.database()
				.ref()
				.child('chat_members')
				.child(roomid)
				.child(_nickname)
				.update({
					nickname: _nickname,
				});
		},
		// async cancel_call() {
		// 	this.$store.state.toNickname = '';
		// 	var _toNickname = this.$store.state.toNickname;
		// 	var nickname = this.$store.state.nickname;

		// 	//[1] 요청자
		// 	await this.$firebase
		// 		.database()
		// 		.ref()
		// 		.child('users')
		// 		.child(nickname)
		// 		.child('rooms/' + this.roomid)
		// 		.update({ disabled: true });
		// 	await this.$firebase
		// 		.database()
		// 		.ref()
		// 		.child('users')
		// 		.child(_toNickname)
		// 		.child('rooms/' + this.roomid)
		// 		.update({ disabled: true });

		// 	this.iscalltrying = false;
		// },
		async ModalPopup(_toNickname) {
			var _nickname = this.$store.state.nickname;
			if (_nickname === '') {
				bus.$emit('show:toast', '로그인 후 이용 가능 합니다.');
			} else if (_nickname !== _toNickname) {
				//초기화

				//[1] 상대방이 통화중이거나 부재중인지 확인.
				//[1-1] 채팅 리스트에 없으면 offline
				//[1-1] 채팅 리스트에 있으면 online  통화중인지..수신거부중인지 등 확이
				// console.log('starCountRef nickname : ' + _toNickname);
				var starCountRef = this.$firebase
					.database()
					.ref()
					.child('users')
					.child(_toNickname);

				var is = false;

				await starCountRef
					.get()
					.then(function(snapshot) {
						if (snapshot.exists()) {
							const data = snapshot.val();

							if (!data) {
								// bus.$emit('show:toast', _toNickname + '님은 offline입니다.');
							} else {
								if (data.onlineState) {
									is = true;
								} else {
									is = false;
									bus.$emit('show:toast', _toNickname + '님은' + data.status);
								}
							}
						} else {
							bus.$emit('show:toast', _toNickname + '님은 offline입니다.');
						}
					})
					.catch(function(error) {
						console.error('error             1234   :      ' + error);
					});
				this.$store.state.isModalViewed = is;
				this.$store.state.toNickname = _toNickname;
			} else {
				bus.$emit('show:toast', '본인에게는 요청 할 수 없어요.');
			}
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
/* .tns-item {

}
.tns-item:nth-child(odd) {
} */
</style>
