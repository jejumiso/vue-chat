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
			{{ this.to_nickname }}
			<button @click="video_call(to_nickname)" :disabled="willcall">연결하기</button>
			<div v-if="willcall">
				<div>연결대기중입니다.</div>
				<button @click="cancel_call(to_nickname)">취소</button>
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
			keyvalue: '',
			willcall: false,
			to_nickname: '',
			roomid: '',
		};
	},
	methods: {
		closemodel() {
			console.log('$store.toId');
			this.cancel_call(this.to_nickname);
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
		async video_call(to_nickname) {
			var roomid = '';
			var from_nickname = this.$store.state.nickname;
			// [1] 생성된 방이 있는지 확인한다.
			await this.$firebase
				.database()
				.ref()
				.child('users')
				.child(from_nickname)
				.child('rooms')
				.get()
				.then(function(snapshot) {
					if (snapshot.exists()) {
						for (var room in snapshot.val()) {
							if (snapshot.child(room).val().chatMember === to_nickname) {
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
					.child(to_nickname)
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
				messageUser: { nickname: from_nickname }, //메시지 보낸사람
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
				.child(from_nickname)
				.child('rooms')
				.child(roomid)
				.update({
					chatId: roomid,
					creDate: '생성한날짜',
					disabled: false,
					lastMessage: '마지막메시지',
					title: to_nickname + '으로 부터....',
					chatMember: to_nickname,
					lastUpdateMember: from_nickname,
					totalUnreadCount: 0,
				});
			//[4 - 4]  요청자에게...
			await this.$firebase
				.database()
				.ref()
				.child('users')
				.child(to_nickname)
				.child('rooms')
				.child(roomid)
				.update({
					chatId: roomid,
					creDate: '생성한날짜',
					disabled: false,
					lastMessage: '마지막메시지',
					title: to_nickname + '으로 부터....',
					chatMember: from_nickname,
					lastUpdateMember: from_nickname,
					totalUnreadCount: 0,
				});
			//[5 - 1]  요청 받는자에게
			await this.$firebase
				.database()
				.ref()
				.child('chat_members')
				.child(roomid)
				.child(to_nickname)
				.update({
					nickname: to_nickname,
				});
			//[5 - 1]  요청자에게...
			await this.$firebase
				.database()
				.ref()
				.child('chat_members')
				.child(roomid)
				.child(from_nickname)
				.update({
					nickname: from_nickname,
				});
			this.willcall = true;
		},
		async cancel_call(to_nickname) {
			var from_nickname = this.$store.state.nickname;

			//[1] 요청자
			await this.$firebase
				.database()
				.ref()
				.child('users')
				.child(from_nickname)
				.child('rooms/' + this.roomid)
				.update({ disabled: true });
			await this.$firebase
				.database()
				.ref()
				.child('users')
				.child(to_nickname)
				.child('rooms/' + this.roomid)
				.update({ disabled: true });

			this.willcall = false;
		},
		async ModalPopup(to_nickname) {
			var from_nickname = this.$store.state.nickname;
			if (from_nickname !== to_nickname) {
				this.to_nickname = to_nickname;
				//초기화
				this.willcall = false;

				//[1] 상대방이 통화중이거나 부재중인지 확인.
				//[1-1] 채팅 리스트에 없으면 offline
				//[1-1] 채팅 리스트에 있으면 online  통화중인지..수신거부중인지 등 확이
				console.log('starCountRef nickname : ' + to_nickname);
				var starCountRef = this.$firebase
					.database()
					.ref()
					.child('users')
					.child(to_nickname);

				var is = false;

				await starCountRef
					.get()
					.then(function(snapshot) {
						if (snapshot.exists()) {
							const data = snapshot.val();

							if (!data) {
								bus.$emit('show:toast', to_nickname + '님은 offline입니다.');
							} else {
								if (data.onlineState) {
									is = true;
								} else {
									is = false;
									bus.$emit('show:toast', to_nickname + '님은' + data.status);
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
				console.log('this.isModalViewed = is ~~~~~~~~: 모달 : ' + this.isModalViewed);
				this.$store.toId = to_nickname;
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
