<template>
	<header class="header">
		<div class="item__fnc">
			<button type="button" class="button-icon button--back" role="link" @click="onBack">
				<span class="blind">이전화면</span>
			</button>
		</div>
		<h1 class="title"><em class="header-logo">KoMeet</em></h1>
		<div class="item__fnc">
			<button type="button" class="button-icon button--notice new" role="link" @click="onMenu">
				<span class="blind">알림</span>
			</button>
			<!-- //새 알림 있는 경우 .new 추가 -->
		</div>
	</header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const menuOpen = ref(false);

const onBack = () => {
	router.back();
};

const onMenu = () => {
	menuOpen.value = true;
};
</script>

<style lang="css" scoped></style>
