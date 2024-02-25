<template>
	<SearchModal v-if="searchModalValue" @update:search-modal-value="closeSearchModal" />
	<!-- 검색 -->
	<div class="search-wrap">
		<div class="input-wrap">
			<p class="logo-wrap">
				<!-- <em class="header-logo"><span>Ko</span><span>Meet</span></em> -->
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
				<button class="button button--search" role="link" @click="openSearchModal">
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
import SearchModal from './SearchModal.vue';
import { ref } from 'vue';
import { modalOpenClass, modalCloseClass } from '@/services/utils';

const searchModalValue = ref(false);
const notificationModalValue = ref(false);

const openNotificationModal = () => {
	notificationModalValue.value = true;
};

const openSearchModal = () => {
	searchModalValue.value = true;
	modalOpenClass();
};

const closeSearchModal = () => {
	searchModalValue.value = false;
	modalCloseClass();
};

const onHome = () => {
	router.push('/');
};
</script>

<style lang="scss" scoped></style>
