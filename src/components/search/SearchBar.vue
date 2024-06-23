<template>
	<!-- <SearchModal v-if="searchModalValue" @update:search-modal-value="closeSearchModal" /> -->
	<!-- 검색 -->
	<div class="search-wrap">
		<div class="input-wrap">
			<p class="logo-wrap" style="display: none;">
				<em class="header-logo">
					<span>K</span>
					<span>a</span>
					<span>t</span>
					<span>h</span>
					<span>e</span>
					<span>r</span>
				</em>
				<!-- <img src="@/assets/images/icon-logo.png" alt="ko-meet" @click="onHome" /> -->
			</p>
			<div class="input__inner">
				<button class="button button--search" role="link" @click="onSearch">
					<span>{{ t('searchBar.keywordPlaceHolder') }}</span>
				</button>
			</div>
			<button type="button" class="button-icon button--notice" :class="{ new: userInfo.unreadNotification }" role="link"
				@click="onMenuOpen">
				<i class="blind">알림</i>
			</button>
		</div>
	</div>
	<!-- 알림 모달 -->
	<NotificationModal v-if="onMenu" @close="onMenuClose" />
</template>

<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';
import NotificationModal from '@/components/notification/NotificationModal.vue';
import { useI18n } from 'vue-i18n';
import { useUserInfoStore } from '@/stores/userInfo';

const userInfo = useUserInfoStore();

const { t } = useI18n();

const onMenu = ref(false);
const userSeq = ref(0);

// 알림 메뉴 열기
const onMenuOpen = () => {
	userSeq.value = 1;
	onMenu.value = true;
};

const onMenuClose = () => {
	onMenu.value = false;
};
// 검색 페이지로 이동
const onSearch = () => router.push(`/search`);
</script>
