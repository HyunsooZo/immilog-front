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

// 예시 지역 데이터 배열
const regions = ref([
	{ name: '전체', code: 'ALL' },
	{ name: '말레이시아', code: 'MALAYSIA' },
	{ name: '싱가포르', code: 'SINGAPORE' },
	{ name: '인도네시아', code: 'INDONESIA' },
	{ name: '베트남', code: 'VIETNAM' },
	{ name: '필리핀', code: 'PHILIPPINES' },
	{ name: '태국', code: 'THAILAND' },
	{ name: '미얀마', code: 'MYANMAR' },
	{ name: '캄보디아', code: 'CAMBODIA' },
	{ name: '라오스', code: 'LAOS' },
	{ name: '브루나이', code: 'BRUNEI' },
	{ name: '동티모르', code: 'EAST_TIMOR' },
	{ name: '중국', code: 'CHINA' },
	{ name: '일본', code: 'JAPAN' },
	{ name: '대한민국', code: 'SOUTH_KOREA' },
	{ name: '오스트레일리아', code: 'AUSTRALIA' },
	{ name: '뉴질랜드', code: 'NEW_ZEALAND' },
	{ name: '괌', code: 'GUAM' },
	{ name: '사이판', code: 'SAI_PAN' },
	{ name: '기타국가', code: 'ETC' },
]);

const selectedCountry = ref('ALL');

// 현재 활성화된 지역 인덱스를 추적하는 ref
const activeRegionIndex = ref(0);

// 지정된 인덱스의 지역이 활성화되었는지 확인하는 함수
const isActiveRegion = name => {
	const index = regions.value.findIndex(region => region.name === name);
	return index === activeRegionIndex.value;
};

const emit = defineEmits(['select:country']);

// 활성화된 지역을 설정하는 함수
const setActiveRegion = item => {
	const index = regions.value.findIndex(region => region.name === item.name);
	activeRegionIndex.value = index;
	selectedCountry.value = regions.value[index].code;
	emit('select:country', item);
};
</script>
