<template>
	<div class="modal default--dialog" tabindex="-1" role="dialog" @click.self="closeModal">
		<div class="modal-content">
			<!-- <div class="modal-header">
				<button type="button" class="button-icon button--close" @click="closeModal">
					<i class="blind">닫기</i>
				</button>
			</div> -->
			<div class="modal-body">
				<div class="list-wrap">
					<ul>
						<li class="item">
							<button type="button" class="button" @click="reportUser">
								<span>신고하기</span>
							</button>
						</li>
						<li class="item">
							<button type="button" class="button" @click="exit">
								<span>방 나가기</span>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<ConfirmModal v-if="onConfirmModal" :modalText="modalText" @close="closeConfirmModal" @confirm="exitChatRoom" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { applicationJsonWithToken } from '@/utils/header';
import { useUserInfoStore } from '@/stores/userInfo';
import ConfirmModal from './ConfirmModal.vue';
import api from '@/api';

const userInfo = useUserInfoStore();

const props = defineProps({
	chatRoomSeq: Number,
});
const emits = defineEmits(['close', 'closeWithDelete']);

const closeModal = () => {
	emits('close');
};

const reportUser = () => {
	console.log('신고하기');
};

const getOutOfChatRoom = async () => {
	const { status } = await api.delete(
		`/chat/rooms/${props.chatRoomSeq}`,
		applicationJsonWithToken(userInfo.accessToken),
	);
	if (status === 204) {
		console.log('방 나가기 성공');
	}
};

const onConfirmModal = ref(false);
const modalText = ref('정말 방을 나가시겠습니까?');

const closeConfirmModal = () => {
	onConfirmModal.value = false;
};

const exitChatRoom = () => {
	onConfirmModal.value = false;
	getOutOfChatRoom();
	emits('closeWithDelete', props.chatRoomSeq);
};

const exit = () => {
	onConfirmModal.value = true;
};
</script>
