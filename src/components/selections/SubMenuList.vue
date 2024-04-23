<template>
	<div class="sub-menu-wrap">
		<ul class="sub-menu__inner">
			<li class="sub-menu__list" v-for="(subMenu, index) in subMenus" :key="index"
				:class="{ active: isActive(subMenu.name) }">
				<button type="button" class="button" @click="setActiveRegion(subMenu)">
					{{ t(subMenu.name) }}
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ISelectItem } from '@/types/interface';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const selectedCountry = ref('ALL');

// 현재 활성화된 지역 인덱스를 추적하는 ref
const activeRegionIndex = ref(0);

const prop = defineProps<{
	subMenus: ISelectItem[];
}>();

// 지정된 인덱스의 지역이 활성화되었는지 확인하는 함수
const isActive = (name: string) => {
	const index = prop.subMenus.findIndex(subMenu => subMenu.name === name);
	return index === activeRegionIndex.value;
};

const emit = defineEmits(['select:country']);

// 활성화된 지역을 설정하는 함수
const setActiveRegion = (item: { name: string; }) => {
	const index = prop.subMenus.findIndex(subMenu => subMenu.name === item.name);
	activeRegionIndex.value = index;
	selectedCountry.value = prop.subMenus[index].code;
	emit('select:country', item);
};
</script>
