<template>
	<div class="modal" tabindex="-1" role="dialog">
		<div class="modal-content" @click.stop>
			<div class="modal-body">
				<p>{{ alertText }}</p>
			</div>
			<div class="modal-footer">
				<div class="button-wrap">
					<button type="button" class="button button--positive" @click="closeModal">
						{{ UI_TEXT.CONFIRM_BUTTON }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { UI_TEXT } from '@/constants/index.js';

interface Props {
	alertText: string;
}

const { alertText } = defineProps<Props>();

const emits = defineEmits(['update:alertValue']);

const closeModal = () => {
	emits('update:alertValue', false);
};
</script>
