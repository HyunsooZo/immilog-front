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
							<button type="button" class="button" @click="editPost()">
								<span>수정</span>
							</button>
						</li>
						<li class="item">
							<button type="button" class="button" @click="deletePost()">
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
import { useRouter } from 'vue-router';
import { applicationJsonWithToken } from '@/utils/header';
import axios, { AxiosResponse } from 'axios';
import ConfirmModal from './ConfirmModal.vue';

const router = useRouter();
const props = defineProps({
	postSeq: Number,
});
const emits = defineEmits(['close', 'delete', 'edit']);

const closeModal = () => {
	emits('close');
};

const editPost = () => {

};

const deletePost = async () => {
	try {
		const response: AxiosResponse<void> = await axios.delete(
			`/posts/${props.postSeq}/delete`,
			applicationJsonWithToken,
		);
		if (response.status === 204) {
			router.push('/board');
		}
	} catch (error) {
		console.log(error);
	}
};

const onConfirmModal = ref(false);
const modalText = ref('게시물을 삭제 하시겠습니까?');

const closeConfirmModal = () => {
	onConfirmModal.value = false;
};

const onDeletePost = () => {
	onConfirmModal.value = false;
	deletePost();
	emits('delete', props.postSeq);
};
</script>
