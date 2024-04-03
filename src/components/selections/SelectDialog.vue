<template>
	<!-- selectdialog -->
	<div class="modal select--dialog" tabindex="-1" role="dialog" @click.self="closeDialog">
		<transition name="slide-up">
			<div class="modal-content" v-if="isVisible">
				<div class="modal-header">
					<p class="modal-title">{{ title }}</p>
					<button type="button" class="button-icon button--close" role="link" @click="closeDialog">
						<i class="blind">닫기</i>
					</button>
				</div>
				<div class="modal-body">
					<div class="list-wrap">
						<ul>
							<li v-for="(item, index) in list" :key="index" class="item">
								<button type="button" class="button" @click="selectCategory(item)">
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
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ISelectItem } from '@/types/interface.ts';

const { t } = useI18n();

defineProps({
	title: {
		type: String,
		required: true,
	},
	list: {
		list: Array<ISelectItem>,
		required: true,
	},
});

const isVisible = ref(false);

const emit = defineEmits(['close', 'select:value']);

const closeDialog = () => {
	isVisible.value = false;
	emit('close');
};

const selectCategory = (item: any) => {
	emit('select:value', item);
	closeDialog();
};

onMounted(() => {
	isVisible.value = true;
});
</script>
