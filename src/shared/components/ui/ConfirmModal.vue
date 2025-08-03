<template>
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
						{{ UI_TEXT.CANCEL_BUTTON }}
					</button>
					<button
						type="button"
						class="button button--positive"
						@click="closeModalWithConfirm"
					>
						{{ UI_TEXT.CONFIRM_BUTTON }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { UI_TEXT } from '@/shared/constants/index';

interface Props {
	modalText: string;
}

const { modalText } = defineProps<Props>();

const emits = defineEmits(['close', 'confirm']);

const closeModal = () => {
	emits('close');
};

const closeModalWithConfirm = () => {
	emits('confirm');
};
</script>
