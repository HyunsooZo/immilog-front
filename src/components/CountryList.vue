<template>
	<div class="sub-menu-wrap">
		<ul class="sub-menu__inner">
			<li
				class="sub-menu__list"
				v-for="(region, index) in regions"
				:key="index"
				:class="{ active: isActiveRegion(index) }"
			>
				<button type="button" class="button" @click="setActiveRegion(index)">
					{{ region }}
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { ref } from 'vue';

// 예시 지역 데이터 배열
const regions = ref([
	'지역1',
	'지역2',
	'지역3',
	'지역4',
	'지역5',
	'지역6',
	'지역7',
	'지역8',
	'지역9',
]);

// 현재 활성화된 지역 인덱스를 추적하는 ref
const activeRegionIndex = ref(0);

// 지정된 인덱스의 지역이 활성화되었는지 확인하는 함수
const isActiveRegion = index => {
	return index === activeRegionIndex.value;
};

// 활성화된 지역을 설정하는 함수
const setActiveRegion = index => {
	activeRegionIndex.value = index;
};
</script>
