<template>
	<div class="modal default--dialog" tabindex="-1" role="dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">닫기</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<ul>
						<li class="item">
							<button type="button" class="button" @click="editPost(postSeq ? postSeq : 0)">
								<span>수정</span>
							</button>
						</li>
						<li class="item">
							<button type="button" class="button" @click="deletePost(postSeq ? postSeq : 0)">
								<span>삭제</span>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<ConfirmModal v-if="onConfirmModal" :modalText="modalText" @close="closeConfirmModal" @confirm="onDeletePost" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ConfirmModal from './ConfirmModal.vue';
import useAxios from '@/composables/useAxios.ts';
import { useRouter } from 'vue-router';

const router = useRouter();
const { sendRequest } = useAxios(router);
const props = defineProps({
	postSeq: Number,
});
const emits = defineEmits(['close', 'delete', 'edit']);

const closeModal = () => {
	emits('close');
};

const editPost = (seq: number) => {

};

const deletePost = async (seq: number) => {
	const { status } = await sendRequest(
		'delete',
		`/posts/${seq}/delete`,
		{
			headers: {
				contentType: 'application/json',
				AUTHORIZATION: `Bearer ${localStorage.getItem('accessToken')}`,
			},
		},
		undefined,
	);
	if (status === 204) {
		console.log('게시물 삭제 성공');
	}
};

const onConfirmModal = ref(false);
const modalText = ref('게시물을 삭제 하시겠습니까?');

const closeConfirmModal = () => {
	onConfirmModal.value = false;
};

const onDeletePost = () => {
	onConfirmModal.value = false;
	deletePost(props.postSeq ? props.postSeq : 0);
	emits('delete', props.postSeq);
};
</script>
