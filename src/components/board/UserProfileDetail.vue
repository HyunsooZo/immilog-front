<template>
	<div class="modal modal--full" tabindex="-1" role="dialog">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">
					{{ userProfile.userNickName }}
					<span>{{ t('userProfileDetailView.userProfileDetail') }}</span>
				</p>
				<button class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap personal__view">
					<div class="item">
						<div class="info__wrap">
							<button type="button" class="item__pic" :class="{ 'pic--default': !userProfile.userProfileUrl }"
								role="link" @click="onUserProfilePic">
								<img v-if="userProfile.userProfileUrl" :src="userProfile.userProfileUrl" alt="" />
							</button>
							<div class="item__fnc">
								<div class="list__item">
									<em>{{ userProfile.country }}</em>
									<em>{{ userProfile.region }}</em>
								</div>
								<div class="list__item user">
									<strong>{{ userProfile.userNickName }}</strong>
								</div>
							</div>
						</div>
						<div class="button-wrap">
							<button class="button button--primary button__s" role="link">
								{{ t('userProfileDetail.posts') }}
							</button>
							<!-- 본인 프로필은 채팅, 신고 버튼 미노출 -->
							<button class="button button--primary button__s" role="link" @click="onChatRoom">
								{{ t('userProfileDetail.chat') }}
							</button>
							<button class="button button--primary button__s" role="link">
								{{ t('userProfileDetail.report') }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<UserProfilePic :userProfile=userProfile @close="offUserProfilePic" v-if="isUserProfilePicOn" />
	<UserBoard :userSeq=userProfile.userSeq @close="offUserBoard" v-if="isUserBoardOn" />
</template>

<script setup lang="ts">
import UserProfilePic from '@/components/board/UserProfilePic.vue';
import router from '@/router';
import { IApiChatStart } from '@/types/api-interface';
import { IOtherUserInfo } from '@/types/interface';
import { applicationJsonWithToken } from '@/utils/header';
import axios, { AxiosResponse } from 'axios';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserInfoStore } from '@/stores/userInfo';
import UserBoard from './UserBoard.vue';

const { t } = useI18n();

const props = defineProps({
	userProfile: {
		type: Object as () => IOtherUserInfo,
		required: true,
		default: () => ({
			userSeq: 0,
			userProfileUrl: '',
			userNickName: '',
			country: '',
			region: '',
		}),
	},
});

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};

// modal close 시 body 컨트롤
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

// 프로필 사진
const isUserProfilePicOn = ref(false);
const onUserProfilePic = () => {
	isUserProfilePicOn.value = true;
};
const offUserProfilePic = () => {
	isUserProfilePicOn.value = false;
};

//모달 닫는 에밋
const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
	modalCloseClass();
};

const onChatRoom = async () => {
	const response: AxiosResponse<IApiChatStart> = await axios.post(
		`/chat/rooms?counterpartSeq=${props.userProfile.userSeq}`,
		{},
		applicationJsonWithToken(localStorage.getItem('accessToken')),
	);

	if (response.data.status === 200) {
		router.push(`/chat/${response.data.data}`);
	}
};

// 내 게시물 표시 상태
const isUserBoardOn = ref(false);
const onUserBoard = () => {
	isUserBoardOn.value = true;
	modalOpenClass();
};
const offUserBoard = () => {
	isUserBoardOn.value = false;
	modalCloseClass();
};

onMounted(() => {
	if (!useUserInfoStore().userSeq) {
		closeModal();
		router.push('/sign-in');
	}
	if (props.userProfile.userSeq === useUserInfoStore().userSeq) {
		closeModal();
		router.push('/my-page');
	}
});

</script>
