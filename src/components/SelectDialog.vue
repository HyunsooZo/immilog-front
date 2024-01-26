<template>
	<!-- selectdialog -->
	<div class="modal-container select--dialog">
		<div class="modal" tabindex="-1" role="dialog" @click.self="closeDialog">
			<div class="modal-content">
				<div class="modal-header">
					<p class="modal-title">{{ title }}</p>
					<button
						type="button"
						class="button-icon button--close"
						role="link"
						@click="closeDialog"
					>
						<span>닫기</span>
					</button>
				</div>
				<div class="modal-body">
					<ul class="list-wrap">
						<li v-for="(item, index) in list" :key="index" class="item">
							<button
								type="button"
								class="button"
								@click="selectCategory(item.code)"
							>
								<span>{{ item.name }}</span>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	title: {
		type: String,
		required: true,
	},
	list: {
		type: Array,
		required: true,
	},
});
const emit = defineEmits(['close', 'select:value']);

const closeDialog = () => {
	emit('close');
};

const selectCategory = item => {
	emit('select:value', item);
	closeDialog();
};
</script>

<style lang="scss" scoped></style>
