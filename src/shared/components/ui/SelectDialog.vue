<template>
	<!-- selectdialog -->
	<div
		class="modal select--dialog"
		tabindex="-1"
		role="dialog"
		@click.self="closeModal"
	>
		<transition name="slide-up">
			<div class="modal-content" v-if="isVisible">
				<div class="modal-header">
					<p class="modal-title">{{ title }}</p>
					<button
						type="button"
						class="button-icon button--close"
						@click="closeModal"
					>
						<i class="blind">닫기</i>
					</button>
				</div>
				<div class="modal-body">
					<div class="list-wrap">
						<ul>
							<li v-for="(item, index) in list" :key="index" class="item">
								<button
									type="button"
									class="button"
									@click="selectCategory(item)"
								>
									<span>{{ t(item.name) }}</span>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { PropType, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ISelectItem } from '@/shared/types/common';

const { t } = useI18n();

defineProps({
	title: {
		type: String,
		required: true,
	},
	list: {
		type: Array as PropType<ISelectItem[]>,
		required: true,
		default: () => [],
	},
});

const isVisible = ref(false);

const emit = defineEmits(['close', 'select:value']);

const closeModal = () => {
	isVisible.value = false;
	emit('close');
};

const selectCategory = (item: ISelectItem) => {
	emit('select:value', item);
	closeModal();
};

onMounted(() => {
	isVisible.value = true;
});
</script>
