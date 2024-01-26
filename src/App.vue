<template>
	<main>
		<router-view />
		<TheFooter v-if="!hideFooter" />
	</main>
</template>

<script setup>
import TheFooter from './components/layouts/TheFooter.vue';
</script>
