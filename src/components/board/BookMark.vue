<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">{{ t('bookMarkView.bookMark') }}</p>
				<button type="button" class="button-icon button--close" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body" ref="scrollBody">
				<div class="sticky-wrap" :class="{ active: isStickyWrap }">
					<div class="menu-wrap">
						<ul class="menu__inner">
							<li v-for="(menu, index) in menus" :key="index" :class="{ active: menu.active.value }" class="menu__list">
								<button type="button" @click="selectMenu(menu)" class="button"
									:aria-selected="menu.active.value ? 'true' : 'false'">
									{{ menu.label }}
								</button>
							</li>
						</ul>
						<span class="menu__bar" :style="{ left: menuBarLeft, width: menuBarWidth }"></span>
					</div>
				</div>
				<div class="list-wrap">
					<BoardContent v-for="(item, index) in state.posts" :key="index" :post="item" :jobPost="emptyJobPost"
						:isJobBoard="false" :detail="false" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import { getBookmarkedPostApi } from '@/services/post.ts';
import { useI18n } from 'vue-i18n';
import { emptyJobPost } from '@/utils/emptyObjects';
import BoardContent from '@/components/board/BoardContent.vue';

const { t } = useI18n();

const emits = defineEmits(['update:bookmarkValue']);

const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

const menus = [
	{ label: t('bookMark.post'), active: ref(true) },
	{ label: t('bookMark.jobPost'), active: ref(false) },
];

const closeModal = () => {
	emits('update:bookmarkValue', false);
};

const fetchBookmarkList = async () => {
	state.value.loading = true;
	try {
		const { status, data } = await getBookmarkedPostApi();
		if (status === 200) {
			state.value.posts = data.data;
		}
	} catch (error) {
		console.error(error);
	} finally {
		state.value.loading = false;
	}
};

// 스크롤 관련 상태 및 이벤트 핸들러
const isStickyWrap = ref(false);
const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');
const scrollBody = ref<HTMLElement | null>(null);

const handleScrollEvent = () => {
	if (scrollBody.value) {
		scrollBody.value.addEventListener('scroll', handleStickyWrap);
	}
	return () => {
		if (scrollBody.value) {
			scrollBody.value.removeEventListener('scroll', handleStickyWrap);
		}
	};
};
// 레이어팝업 내 스크롤 영역
const handleStickyWrap = () => {
	if (scrollBody.value) {
		isStickyWrap.value = scrollBody.value.scrollTop > 0;
	}
};
// 메뉴바 관련 메소드
const updateMenuBar = () => {
	const activeButton = document.querySelector('.menu__list.active .button') as HTMLElement | null;
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

// 메뉴 선택
const selectMenu = (selectedMenu: { active: any; label?: string; }) => {
	selectedMenu.active.value = true;
	menus.filter(menu => menu !== selectedMenu).forEach(menu => menu.active.value = false);
	nextTick(() => updateMenuBar());
};

onMounted(() => {
	fetchBookmarkList();
	updateMenuBar();
	handleScrollEvent();
});

onUnmounted(() => {
	handleScrollEvent();
});
</script>
