<template>
	<div class="app">
		여기는 어차피 안보이는 공간임.{{ this.$store.state.videoChat }}

		VideoChat.vue
	</div>
</template>

<script>
console.log('this.$store.state.videoChat');
export default {
	mounted() {
		this.$store.state.videoChat = true;
	},
};
</script>

<style></style>
