<template>
	<header>
		<div class="header">
			<div class="h-unit">
				<button type="button" class="button-util-icon back" @click="onBack">
					이전화면
				</button>
			</div>
			<h1>KoMeet</h1>
			<div class="h-unit">
				<button type="button" class="button-util-icon menu" @click="onMenu">
					전체메뉴
				</button>
			</div>
		</div>
	</header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const menuOpen = ref(false);

const onBack = () => {
	router.go(-1);
};

const onMenu = () => {
	menuOpen.value = true;
};
</script>

<style lang="css" scoped></style>
