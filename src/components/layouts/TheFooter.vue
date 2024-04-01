<template>
	<!-- footer 영역 -->
	<div class="footer">
		<ul class="util-item-wrap">
			<!-- 메뉴 아이템을 반복적으로 렌더링 -->
			<li v-for="(item, index) in menuItems" :key="index" class="util__item">
				<button
					type="button"
					:class="{
						active: activeItem === index,
						item: true,
						[item.styleClass]: true,
					}"
					@click="onMenuItemClick(index)"
				>
					<!-- SVG 아이콘 렌더링 -->
					<svg
						:width="16"
						:height="16"
						:viewBox="iconViewBox"
						aria-hidden="true"
					>
						<!-- 다중 패스 지원 -->
						<path
							v-for="(path, pathIndex) in item.paths"
							:key="pathIndex"
							:d="path"
						/>
					</svg>
					<span>{{ item.label }}</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from '@/stores/menu';
import {
	homeIcon,
	areaIcon,
	chatIcon,
	jobIcon,
	myPageIcon,
} from '@/utils/icons.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const iconViewBox = '0 0 16 16'; // 모든 아이콘에 적용되는 viewBox 값

// 메뉴 아이템 정의
const menuItems = ref([
	// 홈 아이콘
	{
		label: t('footer.home'),
		styleClass: 'home',
		paths: [homeIcon],
	},
	// 내지역 아이콘
	{
		label: t('footer.myCountry'),
		styleClass: 'area',
		paths: [areaIcon],
	},
	// 채팅 아이콘
	{
		label: t('footer.chat'),
		styleClass: 'chat',
		paths: [chatIcon.first, chatIcon.second],
	},
	// 구인/구직 아이콘
	{
		label: t('footer.job'),
		styleClass: 'job',
		paths: [jobIcon.first, jobIcon.second, jobIcon.third],
	},
	// 마이페이지 아이콘
	{
		label: t('footer.myPage'),
		styleClass: 'my',
		paths: [myPageIcon],
	},
]);

// 현재, 그리고 마지막으로 활성화된 메뉴의 인덱스
const activeItem = ref(0);

// 라우트 매핑과 메뉴 아이템 클릭 핸들러
const routeMapping = {
	0: '/',
	1: '/board',
	2: '/chat',
	3: '/job-board',
	4: '/my-page',
};

// 메뉴 아이템 클릭 핸들러
const onMenuItemClick = index => {
	useMenuStore().setMenu(index);
	router.push(routeMapping[index] || '/');
	activeItem.value = index;
};

// 라우트 경로를 메뉴 인덱스에 매핑
const routeToIndexMapping = {
	'/': 0,
	'/board': 1,
	'/chat': 2,
	'/job-board': 3,
	'/my-page': 4,
};

// 현재 라우트가 변경될 때마다 실행되는 watchEffect
watchEffect(() => {
	const path = route.path;
	const mappedIndex = routeToIndexMapping[path];
	console.log(path);
	if (mappedIndex !== undefined) {
		activeItem.value = mappedIndex;
	}
});
</script>
