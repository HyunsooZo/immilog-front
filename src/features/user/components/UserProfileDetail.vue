<template>
	<div class="modal modal--full" tabindex="-1" role="dialog">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">
					{{ userProfile.nickname }}
					<span>{{ t('userProfileDetailView.userProfileDetail') }}</span>
				</p>
				<button class="button-icon button--close" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap personal__view">
					<div class="item">
						<div class="info__wrap">
							<button
								type="button"
								class="item__image"
								:class="{ 'image--default': !userProfile.userProfileUrl }"
								role="link"
								@click="onUserProfileImage"
							>
								<img
									v-if="userProfile.userProfileUrl"
									:src="userProfile.userProfileUrl"
									alt=""
								/>
							</button>
							<div class="item__fnc">
								<div class="list__item">
									<em>{{ t('countries.' + userProfile.country) }}</em>
									<em>{{ userProfile.region }}</em>
								</div>
								<div class="list__item user">
									<strong>{{ userProfile.nickname }}</strong>
								</div>
							</div>
						</div>
						<div class="button-wrap">
							<button
								class="button button--primary button__s"
								@click="onUserBoard"
							>
								{{ t('userProfileDetail.posts') }}
							</button>
							<!-- 본인 프로필은 채팅, 신고 버튼 미노출 -->
							<button
								class="button button--primary button__s"
								@click="onChatRoom"
							>
								{{ t('userProfileDetail.chat') }}
							</button>
							<button
								class="button button--primary button__s _gray"
								@click="onReportPopUp"
							>
								{{ t('userProfileDetail.report') }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<UserProfileImage
		:userProfile="userProfile"
		@close="offUserProfileImage"
		v-if="isUserProfileImageOn"
	/>
	<UserBoard
		:userId="userProfile.userId"
		@close="offUserBoard"
		v-if="isUserBoardOn"
	/>
</template>

<script setup lang="ts">
import type { IApiChatStart } from '@/features/chat/types';
import type { IOtherUserInfo } from '@/shared/types/common';
import { applicationJsonWithToken } from '@/shared/utils/header';
import { AxiosResponse } from 'axios';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import UserProfileImage from '@/features/user/components/UserProfileImage.vue';
import router from '@/core/router/index';
import UserBoard from './UserBoard.vue';
import api from '@/core/api/index';

const { t } = useI18n();

const userInfo = useUserInfoStore();

const props = defineProps({
	userProfile: {
		type: Object as () => IOtherUserInfo,
		required: true,
		default: () => ({
			userId: 0,
			userProfileUrl: '',
			userNickname: '',
			country: '',
			region: '',
		}),
	},
});

// modal open/close 시 body 컨트롤
const isModalOpen = () => {
	document.body.classList.add('inactive');
};

// modal close 시 body 컨트롤
const isModalClose = () => {
	document.body.classList.remove('inactive');
};

// 프로필 사진
const isUserProfileImageOn = ref(false);
const onUserProfileImage = () => {
	isUserProfileImageOn.value = true;
};
const offUserProfileImage = () => {
	isUserProfileImageOn.value = false;
};

//모달 닫는 에밋
const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
	isModalClose();
};

const onChatRoom = async () => {
	const response: AxiosResponse<IApiChatStart> = await api.post(
		`/chat/rooms?counterpartSeq=${props.userProfile.userId}`,
		{},
		applicationJsonWithToken(userInfo.accessToken),
	);

	if (response.data.status === 200) {
		router.push(`/chat/${response.data.data}`);
	}
};

// 내 게시물 표시 상태
const isUserBoardOn = ref(false);
const onUserBoard = () => {
	isUserBoardOn.value = true;
	isModalOpen();
};
const offUserBoard = () => {
	isUserBoardOn.value = false;
	isModalClose();
};

// <-- 알럿 관련
const alertValue = ref(false);
const alertText = ref('');

const openAlert = (content: string) => {
	alertValue.value = true;
	alertText.value = content;
};

const closeAlert = () => {
	alertValue.value = false;
};
// -->

const requestForm = ref({
	reason: '',
	description: '',
});

const reportPopUpValue = ref(false);

const onReportPopUp = () => {
	reportPopUpValue.value = true;
};

const setReportReason = (reason: string, description: string) => {
	requestForm.value.reason = reason;
	requestForm.value.description = description;
};

const reportApi = async (requestForm: {
	reason: string;
	description: string;
}) => {
	try {
		const response: AxiosResponse<void> = await api.patch(
			`/users/${props.userProfile.userId}/report`,
			requestForm,
			applicationJsonWithToken(userInfo.accessToken),
		);

		if (response.status === 204) {
			openAlert('신고가 접수되었습니다.');
		}
	} catch (error) {
		openAlert('신고 접수에 실패했습니다.');
		console.error(error);
	}
};

onMounted(() => {
	if (!useUserInfoStore().userId) {
		closeModal();
		router.push('/sign-in');
	}
	if (props.userProfile.userId === useUserInfoStore().userId) {
		closeModal();
		router.push('/my-page');
	}
});
</script>
