<template>
	<div class="modal" tabindex="-1" role="dialog">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">더 보기</p>
				<button
					type="button"
					class="button-icon button--close"
					role="link"
					@click="closeModal"
				>
					<i class="blind">닫기</i>
				</button>
			</div>
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
	<ConfirmModal
		v-if="onConfirmModal"
		:modalText="modalText"
		@close="closeConfirmModal"
		@confirm="exitChatRoom"
	/>
</template>

<script setup>
import { ref } from 'vue';
import ConfirmModal from './ConfirmModal.vue';
import useAxios from '@/composables/useAxios';

const { sendRequest } = useAxios();
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

const getOutOfChatRoom = async seq => {
	const { status } = await sendRequest(
		'delete',
		`/chat/rooms/${seq}`,
		{
			headers: {
				contentType: 'application/json',
				AUTHORIZATION: `Bearer ${localStorage.getItem('accessToken')}`,
			},
		},
		null,
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
	getOutOfChatRoom(props.chatRoomSeq);
	emits('closeWithDelete', props.chatRoomSeq);
};

const exit = () => {
	onConfirmModal.value = true;
};
</script>
