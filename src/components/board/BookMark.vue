<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">{{ t('bookMarkView.bookMark') }}</p>
				<button class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<!-- 상단 고정 영역 -->
				<div class="sticky-wrap" :class="{ active: isStickyWrap }">
					<!-- 탭 메뉴 -->
					<div class="menu-wrap">
						<ul class="menu__inner">
							<li v-for="(menu, index) in menus" :key="index" :class="{ active: menu.active.value }" class="menu__list">
								<button @click="selectMenu(menu)" type="button" class="button"
									:aria-selected="menu.active.value ? 'true' : 'false'">
									{{ menu.label }}
								</button>
							</li>
						</ul>
						<span class="menu__bar" :style="{ left: menuBarLeft, width: menuBarWidth }"></span>
					</div>
				</div>

				<div class="list-wrap">
					<BoardContent v-for="(item, index) in state.posts" :key="index" :post="item" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import BoardContent from '@/components/board/BoardContent.vue';
import { getBookmarkedPostApi } from '@/services/post.ts';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 스크롤 관련 상태 및 이벤트 핸들러
const isStickyWrap = ref(false);
const handleScrollEvent = () => {
	window.addEventListener('scroll', handleStickyWrap);

	// '.list-top-wrap' 요소의 높이를 가져오기 (높이가 없다면 0으로 처리)
	const listTopHeight: number = document.querySelector('.list-top-wrap')?.getBoundingClientRect().height || 0;

	// handleStickyButton에 listTopHeight 인자 전달
	// window.addEventListener('scroll', () => handleStickyButton(listTopHeight));

	// 이벤트 제거를 위한 함수 반환
	return () => {
		window.removeEventListener('scroll', handleStickyWrap);
		// window.removeEventListener('scroll', () => handleStickyButton(listTopHeight));
	};
};
const handleStickyWrap = () => {
	const scrollY = document.querySelector('.modal-body')?.scrollTop ?? 0;
	isStickyWrap.value = scrollY > 0;
};

const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');

// select 관련 메소드 (메뉴)
const selectMenu = (selectedMenu: { active: any; label?: string; }) => {
	selectedMenu.active.value = true;
	menus
		.filter(menu => menu !== selectedMenu)
		.forEach(menu => {
			menu.active.value = false;
		});
	nextTick(() => {
		updateMenuBar();
	});
};

// 게시글 목록 관련 상태
let menus = [
	{ label: '게시글', active: ref(true) },
	{ label: '구인/구직', active: ref(false) },
];
// 메뉴바 관련 메소드
const updateMenuBar = () => {
	const activeButton = document.querySelector('.menu__list.active .button') as HTMLElement | null;
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

const fetchBookmarkList = async () => {
	state.value.loading = true;
	try {
		const { status, data } = await getBookmarkedPostApi();
		if (status === 200) {
			state.value.posts = data.data;
		}
	} catch (error) {
		console.log(error);
	} finally {
		state.value.loading = false;
	}
};

//모달 닫는 에밋 (false 넘김)
const emits = defineEmits(['update:bookmarkValue']);

const closeModal = () => {
	emits('update:bookmarkValue', false);
};

onMounted(() => {
	updateMenuBar();
	handleScrollEvent();
	fetchBookmarkList();
});
</script>
