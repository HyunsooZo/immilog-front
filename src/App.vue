<template>
	<main>
		<div id="app">
			<router-view />
			<TheFooter v-if="!hideFooter" />
		</div>
	</main>
</template>

<script setup>
import TheFooter from './components/layouts/TheFooter.vue';
</script>
