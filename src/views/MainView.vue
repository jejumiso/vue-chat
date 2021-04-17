<template>
	<div>
		<AppHeader></AppHeader>
		<BestBj></BestBj>
		<div class="main list-container contents">
			<!-- <ul v-if="postItems">
				<li v-for="item in postItems" :key="item._id">
					<div class="post-title">
						<router-link :to="`/post/${item._id}`">{{
							item.title
						}}</router-link>
					</div>
					<div class="post-contents">
						{{ item.contents }}
					</div>
					<div class="post-time">
						{{ item.createdAt | formatDate }}
						<i class="icon ion-md-create" @click="editPost(item._id)"></i>
						<i class="icon ion-md-trash" @click="removePost(item._id)"></i>
					</div>
				</li>
			</ul> -->
		</div>
		<AppFooter></AppFooter>
	</div>
</template>

<script>
import BestBj from '@/components/BestBj.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';

export default {
	components: {
		BestBj,
		AppHeader,
		AppFooter,
	},
};
</script>

<style scoped>
.list-container {
	padding-top: 13px;
}
.list-container.sticky {
	margin-top: 76px;
}
ul {
	display: flex;
	flex-wrap: wrap;
}
ul > li {
	position: relative;
	flex-grow: 1;
	width: 320px;
	height: 250px;
	margin: 7px;
	padding: 10px 20px;
	background: white;
	box-shadow: 0 20px 20px rgba(0, 0, 0, 0.08);
	border-radius: 3px;
}
.post-title {
	font-size: 24px;
	font-weight: 600;
	margin-bottom: 0.5rem;
}
.post-contents {
	height: 160px;
	overflow-y: auto;
	font-size: 18px;
}
.post-time {
	position: absolute;
	bottom: 4px;
	right: 5px;
	font-size: 14px;
	color: #9e9e9e;
}
.icon {
	font-size: 1.3rem;
	cursor: pointer;
	color: #364f6b;
	padding-right: 0.4rem;
}
.icon:hover {
	color: #3fc1c9;
}
.icon:active {
	color: #fc5185;
}
.ion-md-create {
	padding-left: 0.1rem;
}
</style>
