<template>
	<div class="modal modal--full" tabindex="-1" role="dialog">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">{{ post.userNickname }}<span>{{ t('userProfileDetailView.userProfileDetail')
				}}</span></p>
				<button class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap personal__view">
					<div class="item">
						<div class="info__wrap">
							<button type="button" class="item__pic" :class="{ 'pic--default': !post.userProfileUrl }" role="link"
								@click="onUserProfilePic">
								<img v-if="post.userProfileUrl" :src="post.userProfileUrl" alt="" />
							</button>
							<div class="item__fnc">
								<div class="list__item">
									<em>{{ post.country }}</em>
									<em>{{ post.region }}</em>
								</div>
								<div class="list__item user">
									<strong>{{ post.userNickname }}</strong>
								</div>
							</div>
						</div>
						<div class="button-wrap link-type">
							<button class="button-text" role="link">게시글보기</button>
						</div>
						<div class="button-wrap">
							<button class="button button--primary button__s" role="link">채팅</button>
							<button class="button button--primary button__s" role="link">신고</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<UserProfilePic @close="offUserProfilePic" v-if="isUserProfilePicOn" />
</template>

<script setup>
import UserProfilePic from '@/components/board/UserProfilePic.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
	post: {
		type: Object,
		required: true,
		default: () => ({
			userProfileUrl: '',
			userNickName: '',
			country: '',
			region: '',
		}),
	},
});

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
</script>
