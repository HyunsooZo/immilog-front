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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
	homeIcon,
	areaIcon,
	chatIcon,
	jobIcon,
	myPageIcon,
} from '@/utils/icons.js';

const router = useRouter();
const iconViewBox = '0 0 16 16'; // 모든 아이콘에 적용되는 viewBox 값

// 메뉴 아이템 정의
const menuItems = [
	// 홈 아이콘
	{
		label: '홈',
		styleClass: 'home',
		paths: [homeIcon],
	},
	// 내지역 아이콘
	{
		label: '내지역',
		styleClass: 'area',
		paths: [areaIcon],
	},
	// 채팅 아이콘
	{
		label: '채팅',
		styleClass: 'chat new',
		paths: [chatIcon.first, chatIcon.second],
	},
	// 구인/구직 아이콘
	{
		label: '구인/구직',
		styleClass: 'job',
		paths: [jobIcon.first, jobIcon.second, jobIcon.third],
	},
	// 마이페이지 아이콘
	{
		label: '마이페이지',
		styleClass: 'my',
		paths: [myPageIcon],
	},
];

const activeItem = ref(0);

// 라우트 매핑과 메뉴 아이템 클릭 핸들러
const routeMapping = {
	0: '/',
	1: '/board',
	2: '/chat',
	3: '/job-board',
	4: '/my-page',
};

const onMenuItemClick = index => {
	router.push(routeMapping[index] || '/');
	activeItem.value = index;
};
</script>
