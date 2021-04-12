<template>
	<div class="app">
		안쓰는거임... 나중에 이거 지우자..
		<VideoChat></VideoChat>
	</div>
</template>

<script>
import VideoChat from '../components/common/VideoChat';
export default {
	components: {
		VideoChat,
	},
	mounted() {
		this.$store.state.videoChat = true;
	},
};
</script>

<style></style>
