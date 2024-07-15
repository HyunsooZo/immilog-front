<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">알림</p>
				<button type="button" class="button-icon button--close" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<div class="item" v-if="login" v-for="(item, index) in state.notifications" :key="index"
						@click="openNotificationDetailModal(item.title, item.content)">
						<div class="text__wrap">
							<button type="button" class="list__item_button">
								<div class="text__item">
									<p class="title">{{ item.title }}</p>
									<p class="text">
										{{ item.content }}
									</p>
								</div>
								<!-- <div class="thumb">
								<img src="@/assets/images/email-icon-logo.png" alt="" />
							</div> -->
							</button>
						</div>
						<div class="util__wrap end">
							<div class="item__fnc">
								<p class="list__item past">
									<i class="blind">작성시간</i><span class="item__count">0000/00/00 00:00:00</span>
								</p>
							</div>
						</div>
					</div>
					<div class="item item--noreply" v-else>
						<div class="noreply__wrap">
							<div class="item__bi">
								<svg viewBox="0 0 16 16" class="bi-blockquote-left">
									<path :d="myPostIcon" />
								</svg>
							</div>
							<div class="noreply__text">
								<p class="text__item">
									알림이 없습니다.
								</p>
								<p class="text__item">
									로그인 후 알림을 확인해 보세요!
								</p>
							</div>
						</div>
					</div>
					<!-- // -->
				</div>
			</div>
		</div>
	</div>
	<NotificationDetailModal v-if="onNotificationDetailModal" :title="currentTitle" :content="currentContent"
		@close="closeNotificationDetailModal" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { applicationJsonWithToken } from '@/utils/header';
import { AxiosResponse } from 'axios';
import { INotificationState } from '@/types/interface';
import { IApiNotifications } from '@/types/api-interface';
import api from '@/api';
import NotificationDetailModal from '@/components/notification/NotificationDetailModal.vue';
import { myPostIcon } from '@/utils/icons.ts';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

//모달 닫는 에밋
const emits = defineEmits(['close']);

const currentTitle = ref('');
const currentContent = ref('');
const userInfo = useUserInfoStore();
const currentPage = ref(0);
const login = ref(false);

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

const closeModal = () => {
	emits('close');
	modalCloseClass();
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
		const response: AxiosResponse<IApiNotifications> = await api.get(
			`/notices?page=${nextPage}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			response.data.data.content.forEach(item => {
				state.value.notifications.push(item);
			});
		}
	} catch (error) {
		console.log(error);
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
	modalOpenClass();
	if (!userInfo.userNickname) {
		login.value = false;
	} else {
		login.value = true;
		await getNotificationsApi(0);
		setUnreadNotificationAsRead();
	}
});

onUnmounted(() => {
	modalCloseClass();
});

// NotificationDetailModal 오픈 및 닫기
const onNotificationDetailModal = ref(false);
const openNotificationDetailModal = (title: string, content: string) => {
	currentTitle.value = title;
	currentContent.value = content;
	onNotificationDetailModal.value = true;
	modalOpenClass();
};
const closeNotificationDetailModal = () => {
	onNotificationDetailModal.value = false;
	modalCloseClass();
};
</script>
