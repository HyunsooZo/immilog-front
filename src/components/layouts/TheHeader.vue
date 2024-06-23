<template>
	<!-- 헤더 영역 -->
	<header class="header">
		<!-- 뒤로 가기 버튼 -->
		<div class="item__fnc">
			<button type="button" class="button-icon button--back" role="link" @click="onBack">
				<i class="blind">이전화면</i>
			</button>
		</div>
		<!-- 로고/타이틀 -->
		<h1 class="title"><em class="header-logo">Immilog</em></h1>
		<!-- 알림 버튼 -->
		<div class="item__fnc" v-if="showNotification">
			<button type="button" class="button-icon button--notice" :class="{ new: userInfo.unreadNotification }" role="link"
				@click="">
				<i class="blind">알림</i>
			</button>
		</div>
	</header>
	<!-- 알림 모달 -->
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/userInfo';
const router = useRouter();
const userInfo = useUserInfoStore();

const props = defineProps({
	showNotification: {
		type: Boolean,
		default: false
	},
});


// 뒤로 가기 기능
const onBack = () => {
	router.back();
};
</script>
