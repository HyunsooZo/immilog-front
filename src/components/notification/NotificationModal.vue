<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">알림</p>
				<button
					class="button-icon button--close"
					role="link"
					@click="closeModal"
				>
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted } from 'vue';

//사용자 고유번호
const props = defineProps({
	userSeq: Number,
});

//모달 닫는 에밋
const emits = defineEmits(['close']);

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

onMounted(() => {
	modalOpenClass();
});
</script>
