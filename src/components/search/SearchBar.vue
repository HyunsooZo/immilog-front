<template>
	<SearchModal v-if="searchModalValue" @update:search-modal-value="closeSearchModal" />
	<!-- 검색 -->
	<div class="search-wrap">
		<div class="input-wrap">
			<p class="logo-wrap">
				<em class="header-logo">
					<span>K</span>
					<span>o</span>
					<span>M</span>
					<span>e</span>
					<span>e</span>
					<span>t</span>
				</em>
				<!-- <img src="@/assets/images/icon-logo.png" alt="ko-meet" @click="onHome" /> -->
			</p>
			<div class="input__inner">
				<button class="button button--search" role="link" @click="onSearch">
					<span>관심 있는 글 검색</span>
				</button>
			</div>
			<button type="button" class="button-icon button--notice new" role="link" @click="openNotificationModal">
				<i class="blind">알림</i>
			</button>
		</div>
	</div>
</template>

<script setup>
import router from '@/router';
import { ref } from 'vue';

const searchModalValue = ref(false);
const notificationModalValue = ref(false);

const openNotificationModal = () => {
	notificationModalValue.value = true;
};

// 검색 페이지로 이동
const onSearch = () => router.push(`/search`);

</script>
