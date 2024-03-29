<template>
	<!-- 헤더 영역 -->
	<header class="header">
		<!-- 뒤로 가기 버튼 -->
		<div class="item__fnc">
			<button
				type="button"
				class="button-icon button--back"
				role="link"
				@click="onBack"
			>
				<i class="blind">이전화면</i>
			</button>
		</div>
		<!-- 로고/타이틀 -->
		<h1 class="title"><em class="header-logo">KoMeet</em></h1>
		<!-- 알림 버튼 -->
		<div class="item__fnc">
			<button
				type="button"
				class="button-icon button--notice new"
				role="link"
				@click="onMenuOpen"
			>
				<i class="blind">알림</i>
			</button>
		</div>
	</header>
	<!-- 알림 모달 -->
	<NotificationModal v-if="onMenu" :userSeq="userSeq" @close="onMenuClose" />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NotificationModal from '@/components/notification/NotificationModal.vue';
const router = useRouter();

// 뒤로 가기 기능
const onBack = () => {
	router.back();
};

</script>

<style lang="css" scoped>
/* 여기에 필요한 CSS 스타일 추가 */
</style>
