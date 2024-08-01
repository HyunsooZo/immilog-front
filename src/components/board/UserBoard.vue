<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">내 게시물</p>
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
					<BoardContent v-for="(item, index) in state.posts" :key="index" :post="item" :jobBoard="emptyJobPost"
						:detail="false" :showAd="true" :isJobBoard="false" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import { applicationJsonWithToken } from '@/utils/header';
import { IApiPosts } from '@/types/api-interface';
import { IState } from '@/types/interface';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import BoardContent from '@/components/board/BoardContent.vue';
import { AxiosResponse } from 'axios';
import api from '@/api';
import { emptyJobPost } from '@/utils/emptyObjects';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const userInfo = useUserInfoStore();

const props = defineProps<{
	userSeq: number;
}>();

const state = ref<IState>({
	posts: [],
	pagination: {
		sort: {
			sorted: false,
			unsorted: true,
			empty: true,
		},
		pageSize: 10,
		pageNumber: 0,
		offset: 0,
		paged: true,
		unpaged: false,
	},
	last: false,
	loading: false,
});

const menus = [
	{ label: t('bookMark.post'), active: ref(true) },
	{ label: t('bookMark.jobBoard'), active: ref(false) },
];

const fetchMyPostList = async (page: number) => {
	state.value.loading = true;
	try {
		const response: AxiosResponse<IApiPosts> = await api.get(
			`/posts/users/${props.userSeq}/page/${page}`,
			applicationJsonWithToken(userInfo.accessToken)
		);
		if (response.status === 200) {
			state.value.posts = response.data.data.content;
		}
	} catch (error) {
		console.log(error);
	} finally {
		state.value.loading = false;
	}
};

//모달 닫는 에밋 (false 넘김)
const emits = defineEmits(['close']);

// modal open/close 시 body 컨트롤
const isModalOpen = () => {
	document.body.classList.add('inactive');
};
const isModalClose = () => {
	document.body.classList.remove('inactive');
};

// 스크롤 관련 상태 및 이벤트 핸들러
const isStickyWrap = ref(false);
const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');
const scrollBody = ref(null);

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

const selectMenu = (selectedMenu: { active: any; label?: string; }) => {
	selectedMenu.active.value = true;
	menus.filter(menu => menu !== selectedMenu).forEach(menu => menu.active.value = false);
	nextTick(() => updateMenuBar());
};

const closeModal = () => {
	emits('close');
	isModalClose();
};

onMounted(() => {
	fetchMyPostList(0);
	isModalOpen();
	updateMenuBar();
	handleScrollEvent();
});
onUnmounted(() => {
	handleScrollEvent();
});
</script>
