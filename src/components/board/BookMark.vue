<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">{{ t('bookMarkView.bookMark') }}</p>
				<button type="button" class="button-icon button--close" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
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
						:isJobBoard="false" :detail="false" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { getBookmarkedPostApi } from '@/services/post.ts';
import { useI18n } from 'vue-i18n';
import { emptyJobPost } from '@/utils/emptyObjects';
import BoardContent from '@/components/board/BoardContent.vue';

const { t } = useI18n();
const isStickyWrap = ref(false);
const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');

const props = defineProps({});
const emits = defineEmits(['update:bookmarkValue']);

const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

const menus = [
	{ label: t('bookMark.post'), active: ref(true) },
	{ label: t('bookMark.jobBoard'), active: ref(false) },
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

const handleScrollEvent = () => {
	window.addEventListener('scroll', handleStickyWrap);
	return () => {
		window.removeEventListener('scroll', handleStickyWrap);
	};
};

const handleStickyWrap = () => {
	const modalBody = document.querySelector('.modal-body')?.scrollTop || 0;
	isStickyWrap.value = modalBody > 0;
};

const selectMenu = (selectedMenu: { active: any; label?: string; }) => {
	selectedMenu.active.value = true;
	menus.filter(menu => menu !== selectedMenu).forEach(menu => menu.active.value = false);
	nextTick(() => updateMenuBar());
};

const updateMenuBar = () => {
	const activeButton = document.querySelector('.menu__list.active .button') as HTMLElement | null;
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

onMounted(() => {
	fetchBookmarkList();
	updateMenuBar();
	handleScrollEvent();
});
</script>
