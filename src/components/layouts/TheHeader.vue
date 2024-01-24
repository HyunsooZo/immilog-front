<template>
	<header class="header">
		<div class="item-fnc">
			<button type="button" class="button-icon button--back" role="link" @click="onBack">
				<span>이전화면</span>
			</button>
		</div>
		<h1>KoMeet</h1>
		<div class="item-fnc">
			<button type="button" class="button-icon button--notice new" role="link" @click="onMenu">
				<span>알림</span>
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
