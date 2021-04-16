<template>
	<ModalView @close-modal="closemodal">
		<button @click="video_call()" :disabled="iscalltrying">연결하기</button>
		<div v-if="iscalltrying">
			<div>연결대기중입니다.</div>
			<button @click="cancel_call()">취소</button>
		</div>
	</ModalView>
</template>

<script>
import ModalView from '@/components/common/Modal';
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
export default {
	data() {
		return {
			iscalltrying: false,
		};
	},
	components: { ModalView },
	methods: {
		closemodal() {
			console.log('closemodel...');
			if (this.$store.state.toNickname !== '') {
				this.cancel_call();
			}
			this.$store.state.isModalViewed = false;
		},
		async cancel_call() {
			var _nickname = this.$store.state.nickname;
			var _toNickname = this.$store.state.toNickname;

			//[1] 요청자
			await this.$firebase
				.database()
				.ref()
				.child('users')
				.child(_nickname)
				.child('rooms/' + this.roomid)
				.update({ disabled: true });
			await this.$firebase
				.database()
				.ref()
				.child('users')
				.child(_toNickname)
				.child('rooms/' + this.roomid)
				.update({ disabled: true });

			this.iscalltrying = false;
			this.$store.state.toNickname = '';
			this.$store.state.isModalViewed = false;
		},
		async video_call() {
			var roomid = '';
			var _nickname = this.$store.state.nickname;
			var _toNickname = this.$store.state.toNickname;
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
				// console.log('생성된 방 rooid    => ' + roomid);
				// console.log('생성된 방 rooid    => ' + roomid);
			}
			this.roomid = roomid;

			var jbRandom = Math.random();
			const channel_id = _toNickname + '_' + Math.floor(jbRandom * 1000000) + '_' + _nickname;
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
				msgData: '보낸 날짜/시간',
				msgType: 'video_call',
				// readUserIds: '', //? 머지?
				channel_id: channel_id,
				isReceiver: false, //요청 받는자 수락 여부
				isCaller: false, // 요청 받는자  : 요청 받는자가 수락 한 이후 요청 받는자가 그것을 확인 후.....
				str_sdate: '', //영상 채팅 시작 시간 : 둘다 접속 된 시간
				str_edate: '', //영상 채팅 종료 시간 : 둘다 접속 된 이후 한면 이상이 종료 된 시간.
				cancel: false, //영상 채팅 연결 이후 취소가 되면 true
				total_sencond: 0, // 채팅 시간 : str_edate - str_sdate
				cancelstr: '', //시간 경과, 요청 받는자의 수신 거부 , 요청자의 취소
			};
			// console.log('1. roomidroomidroomidroomidroomidroomidroomidroomid   : ' + _nickname);
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
					roomid: roomid,
					creDate: '생성한날짜',
					disabled: false,
					lastMessage: '마지막메시지',
					title: _toNickname + '으로 부터....',
					chatMember: _toNickname,
					lastUpdateMember: _nickname,
					totalUnreadCount: 0,
					lastmessageid: messageid,
					lastChannel_id: channel_id,
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
					roomid: roomid,
					creDate: '생성한날짜',
					disabled: false,
					lastMessage: '마지막메시지',
					title: _toNickname + '으로 부터....',
					chatMember: _nickname,
					lastUpdateMember: _nickname,
					totalUnreadCount: 0,
					lastmessageid: messageid,
					lastChannel_id: channel_id,
				});
			//[5 - 1]  요청 받는자에게
			await this.$firebase
				.database()
				.ref()
				.child('chat_members')
				.child(roomid)
				.child(_toNickname)
				.update({
					email: '',
					profileUrl: '',
				});
			//[5 - 1]  요청자에게...
			await this.$firebase
				.database()
				.ref()
				.child('chat_members')
				.child(roomid)
				.child(_nickname)
				.update({
					email: '',
					profileUrl: '',
				});
			this.iscalltrying = true;

			this.stanby(roomid, messageid, channel_id);

			// await this.$firebase
			// 	.database()
			// 	.ref()
			// 	.child('chat_messages/' + roomid + '/' + messageid)
			// 	.update({
			// 		isReceiver: true,
			// 		isCaller: false,
			// 		str_sdate: '',
			// 		str_edate: '',
			// 		iscall: true,
			// 	});
		},
		stanby(roomid, messageid, channel_id) {
			var starCountRef = this.$firebase
				.database()
				.ref()
				.child('chat_messages/' + roomid + '/' + messageid);

			starCountRef.on('value', data => {
				// console.log('4.  bj가 통화 요청을 수락할까?' + data.val().isReceiver);
				// console.log(data);
				// console.log(data.val());
				if (data.val().isReceiver === true && data.val().str_edate === '') {
					console.log('6.  bj가 통화 요청을 수락하였습니다.');
					this.$store.state.isModalViewed = false;
					// eslint-disable-next-line no-undef
					this.$store.state.remonCall = new Remon({ config });
					this.$store.state.remonCall.connectCall(channel_id);
					this.$store.state.isModalViewChat = true;
					// this.iscalltrying = true; //초기화
				} else if (data.val().cancel === true) {
					console.log('4. 상대방이 통화를 종료 하였습니다.');
					// this.$store.state.isModalViewed = false;
					this.$store.state.isModalViewChat = false;
					// this.$store.state.remonCall.close();
					starCountRef.off('value'); // 이렇게 하는게 맞는지 이 위치가 맞는지...
				}
			});
		},
	},
};
</script>

<style></style>
