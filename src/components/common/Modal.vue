<template>
	<!-- https://hasudoki.tistory.com/entry/Vuejs-%EB%AA%A8%EB%8B%AC-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8Modal-Component-%EB%A7%8C%EB%93%A4%EA%B8%B0 -->
	<div class="modal">
		<div class="overlay" @click="$emit('close-modal')"></div>
		<div class="modal-card" style="width:100%;max-width:1200px;margin:0 auto;background-color: white;min-height:100%;">
			<h6>모달입니다.</h6>
			<slot />
		</div>
	</div>
</template>
<script>
export default {};
</script>
<style>
/* Modal */
.modal,
.overlay {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
}
.overlay {
	opacity: 0.5;
	background-color: black;
}
.modal-card {
	position: relative;
	max-width: 80%;
	margin: auto;
	margin-top: 30px;
	padding: 20px;
	background-color: white;
	min-height: 500px;
	z-index: 10;
	opacity: 1;
}
</style>
