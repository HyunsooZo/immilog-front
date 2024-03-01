<template>
	<div class="sub-menu-wrap">
		<ul class="sub-menu__inner">
			<li
				class="sub-menu__list"
				v-for="(region, index) in regions"
				:key="index"
				:class="{ active: isActiveRegion(region.name) }"
			>
				<button type="button" class="button" @click="setActiveRegion(region)">
					{{ region.name }}
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { regions } from '@/utils/selectItems';

const selectedCountry = ref('ALL');

// 현재 활성화된 지역 인덱스를 추적하는 ref
const activeRegionIndex = ref(0);

// 지정된 인덱스의 지역이 활성화되었는지 확인하는 함수
const isActiveRegion = name => {
	const index = regions.findIndex(region => region.name === name);
	return index === activeRegionIndex.value;
};

const emit = defineEmits(['select:country']);

// 활성화된 지역을 설정하는 함수
const setActiveRegion = item => {
	const index = regions.findIndex(region => region.name === item.name);
	activeRegionIndex.value = index;
	selectedCountry.value = regions[index].code;
	emit('select:country', item);
};
</script>
