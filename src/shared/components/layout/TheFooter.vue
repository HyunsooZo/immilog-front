<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from '@/shared/stores/menu';
import {
	homeIcon,
	areaIcon,
	chatIcon,
	// jobIcon,
	myPageIcon,
} from '@/shared/utils/icons';
import { useI18n } from 'vue-i18n';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import { useChatUnreadStore } from '@/features/chat/stores/chatUnread';

const { t, locale } = useI18n();

const route = useRoute();
const router = useRouter();
const userInfo = useUserInfoStore();
const chatUnreadStore = useChatUnreadStore();
const iconViewBox = '0 0 16 16'; // 모든 아이콘에 적용되는 viewBox 값

interface MenuItem {
	label: string;
	styleClass: string;
	paths: string[];
}

const activeItem = ref(0);
const menuItems = ref<MenuItem[]>([]);

// 메뉴 아이템을 설정하는 함수
const setMenuItems = () => {
	menuItems.value = [
		{ label: t('footer.home'), styleClass: 'home', paths: [homeIcon] },
		{ label: t('footer.myCountry'), styleClass: 'area', paths: [areaIcon] },
		{
			label: t('footer.chat'),
			styleClass: 'chat',
			paths: [chatIcon.first, chatIcon.second],
		},
		// {
		// 	label: t('footer.job'),
		// 	styleClass: 'job',
		// 	paths: [jobIcon.first, jobIcon.second, jobIcon.third],
		// },
		{ label: t('footer.myPage'), styleClass: 'my', paths: [myPageIcon] },
	];
};

// 초기 메뉴 아이템 설정
setMenuItems();

// 언어 변경 감지하여 메뉴 아이템 업데이트
watchEffect(() => {
	// 언어 변경 감지를 위해 locale.value를 참조
	if (locale.value) {
		setMenuItems();
	}
});

// 라우트 매핑과 메뉴 아이템 클릭 핸들러
const routeMapping: Record<number, string> = {
	0: '/',
	1: '/board',
	2: '/chat',
	3: '/my-page',
	// 3: '/job-board',
};

const onMenuItemClick = (index: number) => {
	useMenuStore().setMenu(index);
	router.push(routeMapping[index] || '/');
	activeItem.value = index;
};

const routeToIndexMapping: { [key: string]: number } = {
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
	if (mappedIndex !== undefined) {
		activeItem.value = mappedIndex;
	}
});

// 이제 store에서 실시간으로 관리되므로 별도 로직 불필요
</script>

<template>
	<!-- Template 코드 -->
	<div class="footer">
		<ul class="util-item-wrap">
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
					<div class="icon-wrapper">
						<svg
							:width="16"
							:height="16"
							:viewBox="iconViewBox"
							aria-hidden="true"
						>
							<path
								v-for="(path, pathIndex) in item.paths"
								:key="pathIndex"
								:d="path"
							/>
						</svg>
						<!-- 채팅 탭에만 안읽은 메시지 뱃지 표시 -->
						<div 
							v-if="index === 2 && chatUnreadStore.getTotalUnreadCount > 0" 
							class="chat-badge"
						>
							{{ chatUnreadStore.getTotalUnreadCount > 99 ? '99+' : chatUnreadStore.getTotalUnreadCount }}
						</div>
					</div>
					<span>{{ item.label }}</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.icon-wrapper {
	position: relative;
	display: inline-block;
}

.chat-badge {
	position: absolute;
	top: -8px;
	right: -8px;
	background: #ff4757;
	color: white;
	border-radius: 10px;
	padding: 2px 6px;
	font-size: 0.7rem;
	font-weight: bold;
	min-width: 16px;
	height: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 1;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>
