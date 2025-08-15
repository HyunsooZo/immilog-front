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
									<span class="item-with-flag">
										<span 
											v-if="getFlagCode(item.code) && getFlagCode(item.code) !== 'world' && getFlagCode(item.code) !== 'etc'"
											:class="`fi fi-${getFlagCode(item.code)}`"
											class="flag-icon"
										></span>
										<span 
											v-else-if="getFlagCode(item.code) === 'etc'"
											class="custom-icon flag-icon"
										>🏳️</span>
										{{ t(item.name) }}
									</span>
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
import { countryCodeToFlagCode } from '@/shared/utils/flagMapping';

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

const getFlagCode = (countryCode: string): string => {
	return countryCodeToFlagCode(countryCode);
};

onMounted(() => {
	isVisible.value = true;
});
</script>

<style scoped>
.item-with-flag {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.flag-icon {
	width: 1.2em;
	height: 0.9em;
	display: inline-block;
	border-radius: 2px;
}

.custom-icon {
	display: inline-block;
	width: 1.2em;
	height: 1.2em;
	text-align: center;
	font-size: 1em;
}
</style>
