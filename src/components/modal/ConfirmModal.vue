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
						@click="closeModal(false)"
					>
						취소
					</button>
					<button
						type="button"
						class="button button--positive"
						@click="closeModal(true)"
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

const emits = defineEmits(['update:modalValue']);

const closeModal = value => {
	emits('update:modalValue', value);
};
</script>
