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
import { GlobalWebSocketService } from '@/features/chat/services/globalWebSocketService';
import { ChatService } from '@/features/chat/services/chatService';

const { t, locale } = useI18n();

const route = useRoute();
const router = useRouter();
const userInfo = useUserInfoStore();
const chatUnreadStore = useChatUnreadStore();
const iconViewBox = '0 0 16 16'; // 모든 아이콘에 적용되는 viewBox 값

// 글로벌 WebSocket 서비스
let globalWebSocketService: GlobalWebSocketService | null = null;

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

// 초기 안읽은 메시지 수 로드 (한 번만 실행)
const loadInitialUnreadCount = async () => {
	if (!userInfo.userId || !userInfo.accessToken) {
		return;
	}

	try {
		console.log('Loading initial unread count for footer badge');

		// 사용자의 채팅방 목록을 가져와서 안읽은 수 계산
		const chatRooms = await ChatService.getUserChatRooms(
			userInfo.userId,
			userInfo.accessToken,
		);

		// 각 채팅방의 안읽은 메시지 수를 개별적으로 조회
		const unreadCountPromises = chatRooms.map(async room => {
			try {
				const unreadCount = await ChatService.getUnreadCount(
					room.id,
					userInfo.userId!,
					userInfo.accessToken!,
				);
				return { roomId: room.id, unreadCount };
			} catch (error) {
				console.error(`Failed to get unread count for room ${room.id}:`, error);
				return { roomId: room.id, unreadCount: 0 };
			}
		});

		const unreadResults = await Promise.all(unreadCountPromises);

		// Store에 안읽은 수 업데이트
		const unreadCountsMap: Record<string, number> = {};
		unreadResults.forEach(result => {
			unreadCountsMap[result.roomId] = result.unreadCount;
		});

		chatUnreadStore.setAllUnreadCounts(unreadCountsMap);
		console.log('Initial unread counts loaded:', unreadCountsMap);
		console.log('Total unread count:', chatUnreadStore.getTotalUnreadCount);
	} catch (error) {
		console.error('Failed to load initial unread count:', error);
	}
};

// 글로벌 WebSocket 연결
const connectGlobalWebSocket = async (userId: string) => {
	try {
		if (globalWebSocketService) {
			globalWebSocketService.disconnect();
		}

		globalWebSocketService = new GlobalWebSocketService();
		await globalWebSocketService.connect(userId);
		console.log('Global WebSocket connected successfully');
	} catch (error) {
		console.error('Failed to connect global WebSocket:', error);
	}
};

// 글로벌 WebSocket 연결 해제
const disconnectGlobalWebSocket = () => {
	if (globalWebSocketService) {
		globalWebSocketService.disconnect();
		globalWebSocketService = null;
		console.log('Global WebSocket disconnected');
	}
};

onMounted(() => {
	// 앱 시작시 초기 데이터 로드 및 WebSocket 연결
	if (userInfo.userId && userInfo.accessToken) {
		loadInitialUnreadCount();
		connectGlobalWebSocket(userInfo.userId);
	}
});

onUnmounted(() => {
	// 컴포넌트 언마운트시 WebSocket 연결 해제
	disconnectGlobalWebSocket();
});

// 로그인 상태 변경 감지
watchEffect(() => {
	if (userInfo.userId && userInfo.accessToken) {
		// 로그인시 - 초기 데이터 로드 및 WebSocket 연결
		if (
			!globalWebSocketService ||
			globalWebSocketService.getCurrentUserId() !== userInfo.userId
		) {
			loadInitialUnreadCount();
			connectGlobalWebSocket(userInfo.userId);
		}
	} else {
		// 로그아웃시 - WebSocket 해제 및 store 초기화
		disconnectGlobalWebSocket();
		chatUnreadStore.reset();
	}
});
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
							{{
								chatUnreadStore.getTotalUnreadCount > 99
									? '99+'
									: chatUnreadStore.getTotalUnreadCount
							}}
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
