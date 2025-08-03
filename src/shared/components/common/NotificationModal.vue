<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">알림</p>
				<button
					type="button"
					class="button-icon button--close"
					@click="closeModal"
				>
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<!-- 로그인 상태일 때 -->
					<template v-if="login">
						<!-- 알림이 있을 경우 -->
						<div v-if="state.notifications.length > 0">
							<div
								class="item"
								v-for="(item, index) in state.notifications"
								:key="index"
								@click="onNotificationDetailModal(item.title, item.content)"
							>
								<div class="text__wrap">
									<button type="button" class="list__item_button">
										<div class="text__item">
											<p class="title">{{ item.title }}</p>
											<p class="text">
												{{ item.content }}
											</p>
										</div>
									</button>
								</div>
								<div class="util__wrap end">
									<div class="item__fnc">
										<p class="list__item past">
											<i class="blind">작성시간</i>
											<span class="item__count">
												{{ timeCalculation(item.createdAt.toString()).time }}
												{{ t(timeCalculation(item.createdAt.toString()).text) }}
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>
						<!-- 알림이 없을 경우 -->
						<div v-else class="item item--noreply">
							<div class="noreply__wrap">
								<div class="item__bi">
									<svg viewBox="0 0 16 16" class="bi-blockquote-left">
										<path :d="myPostIcon" />
									</svg>
								</div>
								<div class="noreply__text">
									<p class="text__item">공지사항이 존재하지 않습니다.</p>
								</div>
							</div>
						</div>
					</template>
					<!-- 로그인 상태가 아닐 때 -->
					<template v-else>
						<div class="item item--noreply">
							<div class="noreply__wrap">
								<div class="item__bi">
									<svg viewBox="0 0 16 16" class="bi-blockquote-left">
										<path :d="myPostIcon" />
									</svg>
								</div>
								<div class="noreply__text">
									<p class="text__item">알림이 없습니다.</p>
									<p class="text__item">로그인 후 알림을 확인해 보세요!</p>
								</div>
							</div>
						</div>
					</template>
					<!-- // -->
				</div>
			</div>
		</div>
	</div>
	<NotificationDetailModal
		v-if="isNotificationDetailModal"
		:title="currentTitle"
		:content="currentContent"
		@close="offNotificationDetailModal"
	/>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useUserInfoStore } from '@/features/auth/stores/userInfo';
import { applicationJsonWithToken } from '@/shared/utils/header';
import { AxiosResponse } from 'axios';
import type { INotificationState } from '@/shared/types/notification';
import type { IApiNotifications } from '@/shared/types/notification';
import { myPostIcon } from '@/shared/utils/icons';
import { useI18n } from 'vue-i18n';
import { timeCalculation } from '@/shared/utils/date-time';
import NotificationDetailModal from '@/shared/components/common/NotificationDetailModal.vue';
import api from '@/core/api/index';

const { t } = useI18n();

// 모달 닫는 에밋
const emits = defineEmits(['close']);

const currentTitle = ref('');
const currentContent = ref('');
const userInfo = useUserInfoStore();
const currentPage = ref(0);
const login = ref(false);

// modal open/close 시 body 컨트롤
const isModalOpen = () => {
	document.body.classList.add('inactive');
};
const isModalClose = () => {
	document.body.classList.remove('inactive');
};

const closeModal = () => {
	emits('close');
	isModalClose();
};

const state = ref<INotificationState>({
	notifications: [],
	pagination: {
		sort: {
			sorted: false,
			unsorted: true,
			empty: true,
		},
		pageSize: 10,
		pageNumber: 0,
		offset: 0,
		paged: true,
		unpaged: false,
	},
	last: false,
	loading: false,
});

const getNotificationsApi = async (nextPage: number) => {
	try {
		const params = { page: nextPage };
		const response: AxiosResponse<IApiNotifications> = await api.get(
			`/api/v1/notices/users/${userInfo.userSeq}`,
			{
				params,
				...applicationJsonWithToken(userInfo.accessToken),
			},
		);
		if (response.status === 204 || response.data.status === 204) {
			// 공지사항이 없음
			return;
		}
		if (
			response.data.status === 200 &&
			response.data.data &&
			response.data.data.content
		) {
			response.data.data.content.forEach(item => {
				state.value.notifications.push(item);
			});
		} else {
			console.error('Unexpected response structure', response.data);
		}
	} catch (error) {
		console.error(error);
	}
};

// 무한 스크롤 관련 메소드 (스크롤 핸들링)
const handleScroll = () => {
	const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
	if (scrollTop + clientHeight >= scrollHeight - 10) {
		currentPage.value += 1;
		getNotificationsApi(currentPage.value);
	}
};

const setUnreadNotificationAsRead = () => {
	userInfo.setUnreadNotification(false);
};

onMounted(async () => {
	isModalOpen();
	if (!userInfo.userNickname) {
		login.value = false;
	} else {
		login.value = true;
		await getNotificationsApi(0);
		setUnreadNotificationAsRead();
	}
});

onUnmounted(() => {
	isModalClose();
});

// NotificationDetailModal 오픈 및 닫기
const isNotificationDetailModal = ref(false);
const onNotificationDetailModal = (title: string, content: string) => {
	currentTitle.value = title;
	currentContent.value = content;
	isNotificationDetailModal.value = true;
};
const offNotificationDetailModal = () => {
	isNotificationDetailModal.value = false;
};
</script>
