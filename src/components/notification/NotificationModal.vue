<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">알림</p>
				<button class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<div class="item" v-if="login" v-for="(item, index) in state.notifications" :key="index">
						<div class="text__wrap">
							<div class="list__item">
								<div class="text__item">
									<p class="title">{{ item.title }}</p>
									<p class="text">
										{{ item.content }}
									</p>
								</div>
							</div>
						</div>
						<div class="attachments__wrap">
							<div class="attachments__item">
								<div class="item__display">
									<img src="@/assets/images/email-icon-logo.png" alt="" />
								</div>
							</div>
							<!-- //loop -->
						</div>
					</div>
					<div v-else>컨텐츠 없음~</div>
					<!-- // -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { applicationJsonWithToken } from '@/utils/header';
import { AxiosResponse } from 'axios';
import { INotificationState } from '@/types/interface';
import { IApiNotifications } from '@/types/api-interface';
import api from '@/api';

//모달 닫는 에밋
const emits = defineEmits(['close']);

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
</script>
