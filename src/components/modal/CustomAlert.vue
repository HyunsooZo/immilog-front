<template>
	<div class="modal" tabindex="-1" role="dialog">
		<div class="modal-content" @click.stop>
			<div class="modal-body">
				<p v-html="alertText"></p>
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
</template>

<script setup>
const { alertValue, alertText } = defineProps(['alertValue', 'alertText']);

const emits = defineEmits(['update:alertValue']);

const closeModal = () => {
	emits('update:alertValue', false);
};
</script>
