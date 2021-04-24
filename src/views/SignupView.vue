<template>
	<div>
		<AppHeader></AppHeader>
		<SignupForm></SignupForm>
		<AppFooter></AppFooter>
	</div>
</template>

<script>
import SignupForm from '../components/SignupForm.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';

export default {
	components: {
		SignupForm,
		AppHeader,
		AppFooter,
	},
};
</script>
