<template>
	<div class="menu-wrap">
		<ul class="menu__inner">
			<li
				v-for="(tab, index) in tabs"
				:key="index"
				:class="{ active: tab.active }"
				class="menu__list"
			>
				<button
					type="button"
					@click="selectTab(index)"
					class="button"
					:aria-selected="tab.active ? 'true' : 'false'"
				>
					{{ tab.label }}
				</button>
			</li>
		</ul>
		<span
			class="menu__bar"
			:style="{ left: barLeft, width: barWidth }"
		></span>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Tab {
	label: string;
	active: boolean;
}

interface Props {
	tabs: Tab[];
	modelValue?: number;
}

interface Emits {
	(e: 'update:modelValue', value: number): void;
	(e: 'tab-change', index: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const activeIndex = ref(props.modelValue || 0);

// 탭 개수에 따른 너비 계산
const barWidth = computed(() => {
	const tabCount = props.tabs.length;
	return `${100 / tabCount}%`;
});

// 활성 탭에 따른 위치 계산
const barLeft = computed(() => {
	const tabCount = props.tabs.length;
	return `${(activeIndex.value * 100) / tabCount}%`;
});

const selectTab = (index: number) => {
	activeIndex.value = index;
	emit('update:modelValue', index);
	emit('tab-change', index);
};

onMounted(() => {
	// 초기 활성 탭 설정
	if (props.modelValue !== undefined) {
		activeIndex.value = props.modelValue;
	} else {
		// props.tabs에서 active가 true인 탭 찾기
		const activeTabIndex = props.tabs.findIndex(tab => tab.active);
		if (activeTabIndex !== -1) {
			activeIndex.value = activeTabIndex;
		}
	}
});
</script>

