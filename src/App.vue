<template>
	<main>
		<div id="app">
			<TheHeader> </TheHeader>
			<router-view />
		</div>
	</main>
</template>

<script setup>
import TheHeader from './components/layouts/TheHeader.vue';
</script>
