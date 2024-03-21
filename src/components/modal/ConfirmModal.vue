<template>
	<div class="modal" tabindex="-1" role="dialog">
		<div class="modal-content" @click.stop>
			<div class="modal-body">
				<p v-html="modalText"></p>
			</div>
			<div class="modal-footer">
				<div class="button-wrap">
					<button
						type="button"
						class="button button--positive"
						@click="closeModal"
					>
						취소
					</button>
					<button
						type="button"
						class="button button--positive"
						@click="closeModalWithConfirm"
					>
						확인
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const { modalText } = defineProps(['modalText']);

const emits = defineEmits(['close', 'confirm']);

const closeModal = () => {
	emits('close');
};

const closeModalWithConfirm = () => {
	emits('confirm');
};
</script>
