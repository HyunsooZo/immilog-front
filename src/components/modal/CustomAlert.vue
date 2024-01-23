<template>
	<Transition>
		<div v-if="modalValue" class="modal-container">
			<div class="modal" tabindex="-1" role="dialog">
				<div class="modal-content" @click.stop>
					<div class="modal-body">
						<p>{{ modalText }}</p>
					</div>
					<div class="modal-footer">
						<div class="button-wrap">
							<button
								type="button"
								class="button button--positive"
								@click="closeModal"
							>
								확인
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const { modalValue, modalText } = defineProps(['modalValue', 'modalText']);

const emits = defineEmits(['update:modalValue']);

const closeModal = () => {
	emits('update:modalValue', false);
};

const closeModalOutside = () => {
	closeModal();
};
</script>
