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
					<!-- 대륙 필터 (국가 선택 모달일 때만 표시) -->
					<div class="sub-menu-wrap">
						<ul class="sub-menu__inner">
							<li
								v-for="continent in continents"
								:key="continent.code"
								class="sub-menu__list"
								:class="{ active: selectedContinent === continent.code }"
							>
								<button
									type="button"
									class="button"
									@click="selectContinent(continent.code)"
								>
									{{ t(continent.name) }}
								</button>
							</li>
						</ul>
					</div>

					<div class="list-wrap">
						<ul>
							<li
								v-for="(item, index) in filteredList"
								:key="index"
								class="item"
							>
								<button
									type="button"
									class="button"
									@click="selectCategory(item)"
								>
									<span class="item-with-flag">
										<span
											v-if="
												getFlagCode(item.code) &&
												getFlagCode(item.code) !== 'world' &&
												getFlagCode(item.code) !== 'etc'
											"
											:class="`fi fi-${getFlagCode(item.code)}`"
											class="flag-icon"
										></span>
										<span
											v-else-if="getFlagCode(item.code) === 'etc'"
											class="custom-icon flag-icon"
											>🏳️</span
										>
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
import { PropType, onMounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ISelectItem } from '@/shared/types/common';
import { countryCodeToFlagCode } from '@/shared/utils/flagMapping';

const { t } = useI18n();

const props = defineProps({
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
const selectedContinent = ref('ALL');

const emit = defineEmits(['close', 'select:value']);

// 국가 선택 모달인지 확인 (continent 속성이 있는 아이템이 있으면 국가 선택 모달)
const showContinentFilter = computed(() => {
	return props.list.some(item => 'continent' in item);
});

// 대륙 목록 생성
const continents = computed(() => {
	if (!showContinentFilter.value) return [];

	const continentSet = new Set<string>();
	props.list.forEach(item => {
		if ('continent' in item && item.continent) {
			// 대륙 이름 정규화
			let normalizedContinent = item.continent.toUpperCase();
			if (normalizedContinent === 'OTHER') normalizedContinent = 'ETC';
			// ALL은 제외 (중복 방지)
			if (normalizedContinent !== 'ALL') {
				continentSet.add(normalizedContinent);
			}
		}
	});

	const continentList = [];

	// 1. 전체를 맨 첫번째에 추가
	continentList.push({ code: 'ALL', name: 'continents.ALL' });

	// 2. 기타를 제외한 다른 대륙들을 정렬해서 추가
	const otherContinents = Array.from(continentSet)
		.filter(c => c !== 'ETC')
		.sort();
	otherContinents.forEach(continent => {
		continentList.push({
			code: continent,
			name: `continents.${continent}`,
		});
	});

	// 3. 기타가 있으면 맨 마지막에 추가
	if (continentSet.has('ETC')) {
		continentList.push({
			code: 'ETC',
			name: 'continents.ETC',
		});
	}

	return continentList;
});

// 필터링된 목록
const filteredList = computed(() => {
	if (!showContinentFilter.value) {
		return props.list;
	}

	let filteredItems;

	// 'ALL'이 선택된 경우 모든 국가를 반환
	if (selectedContinent.value === 'ALL') {
		filteredItems = props.list.filter(item => 'continent' in item && item.continent);
		
		// "전체국가" 옵션을 맨 앞에 추가 (전체 대륙 선택시에만)
		const allCountriesOption = {
			code: 'ALL',
			name: 'countries.ALL',
			continent: 'ALL'
		};
		
		return [allCountriesOption, ...filteredItems];
	} else {
		// 특정 대륙이 선택된 경우에는 "전체국가" 옵션 없이 해당 대륙의 국가들만 반환
		filteredItems = props.list.filter(item => {
			if (!('continent' in item) || !item.continent) return false;

			let normalizedContinent = item.continent.toUpperCase();
			if (normalizedContinent === 'OTHER') normalizedContinent = 'ETC';

			return normalizedContinent === selectedContinent.value;
		});
		
		return filteredItems;
	}
});

const selectContinent = (continentCode: string) => {
	selectedContinent.value = continentCode;
};

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

/* 대륙 필터 여백 스타일 */
.continent-filter {
	margin-bottom: 1rem;
	border-bottom: 1px solid #eee;
	padding-bottom: 1rem;
}
</style>
