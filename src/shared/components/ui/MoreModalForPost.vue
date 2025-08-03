<template>
	<div
		class="modal default--dialog"
		tabindex="-1"
		role="dialog"
		@click.self="closeModal"
	>
		<div class="modal-content">
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
	<ConfirmModal
		v-if="onConfirmModal"
		:modalText="modalText"
		@close="closeConfirmModal"
		@confirm="onDeletePost"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ConfirmModal from './ConfirmModal.vue';

const props = defineProps({
	postId: String,
});
const emits = defineEmits(['close', 'delete', 'edit']);

const editPost = () => {};

const deletePost = async () => {
	onConfirmModal.value = true;
};

const onConfirmModal = ref(false);
const modalText = ref('게시물을 삭제 하시겠습니까?');

const closeConfirmModal = () => {
	onConfirmModal.value = false;
};

const onDeletePost = () => {
	onConfirmModal.value = false;
	emits('delete', props.postId);
};

//모달 닫는 에밋
const closeModal = () => {
	emits('close');
};
</script>
