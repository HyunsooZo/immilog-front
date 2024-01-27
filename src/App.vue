<template>
	<main>
		<router-view />
		<TheFooter v-if="!hideFooter" />
	</main>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TheFooter from './components/layouts/TheFooter.vue';

const route = useRoute();
const hideFooter = computed(() => route.meta.hideFooter);
</script>
