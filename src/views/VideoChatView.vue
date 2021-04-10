<template>
	<div class="app">
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
