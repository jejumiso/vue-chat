<template>
	<div>
		<AppHeader></AppHeader>
		<LoginForm></LoginForm>
		<AppFooter></AppFooter>
	</div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';

export default {
	components: {
		LoginForm,
		AppHeader,
		AppFooter,
	},
};
</script>
