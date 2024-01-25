<template>
	<Transition>
		<div v-if="alertValue" class="modal-container">
			<div class="modal" tabindex="-1" role="dialog">
				<div class="modal-content" @click.stop>
					<div class="modal-body">
						<p>{{ alertText }}</p>
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

const { alertValue, alertText } = defineProps(['alertValue', 'alertText']);

const emits = defineEmits(['update:alertValue']);

const closeModal = () => {
	emits('update:alertValue', false);
};
</script>
