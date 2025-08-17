<template>
	<div class="chat-detail-page">
		<header class="header _bg" v-if="chatRoom">
		<div class="item__fnc">
			<button
				type="button"
				class="button-icon button--back"
				@click="previousComponent"
			>
				<i class="blind">이전화면</i>
			</button>
		</div>
		<div class="title">
			<div class="chat-room-header">
				<!-- 국가별 채팅방인 경우 국기 표시 -->
				<span 
					v-if="chatRoom.countryId && getFlagCode(chatRoom.countryId) && getFlagCode(chatRoom.countryId) !== 'world' && getFlagCode(chatRoom.countryId) !== 'etc'"
					:class="`fi fi-${getFlagCode(chatRoom.countryId)}`"
					class="header-flag-icon"
				></span>
				<span 
					v-else-if="chatRoom.countryId && getFlagCode(chatRoom.countryId) === 'etc'"
					class="header-custom-flag"
				>🏳️</span>
				<p class="list__item user">
					<strong>{{ chatRoom.name }}</strong>
					<span class="participant-count">{{ chatRoom.participantCount }}명</span>
				</p>
			</div>
		</div>
		<div class="item__fnc">
			<button class="button-icon button--menu" @click="onSideMenu">
				<i class="blind">메뉴</i>
			</button>
		</div>
	</header>

	<div class="content _full" v-if="chatRoom">
		<div class="chat-wrap">
			<!-- 채팅방 안내 메시지 -->
			<div class="chat__msg" v-if="messages.length === 0">
				<p class="text">
					<em class="user__name">{{ chatRoom.name }}</em
					>에서 채팅을 시작해보세요.
				</p>
			</div>

			<!-- 채팅 목록 -->
			<div class="chat__content" ref="chatContent">
				<ul class="chat__list">
					<template v-for="message in messages" :key="message.id">
						<!-- 날짜 구분선 -->
						<li class="item__notice" v-if="shouldShowDateSeparator(message)">
							<span class="text">{{
								formatDateSeparator(message.sentAt)
							}}</span>
						</li>

						<!-- 메시지 -->
						<li
							:id="`message-${message.id}`"
							class="item"
							:class="{
								_my: isMyMessage(message),
								_system: isSystemMessage(message),
							}"
						>
							<!-- 상대방 메시지일 때 프로필 -->
							<div
								class="info__wrap"
								v-if="!isMyMessage(message) && !isSystemMessage(message)"
							>
								<div class="item__image image--default">
									<div class="user-avatar">
										{{ message.senderNickname.charAt(0).toUpperCase() }}
									</div>
								</div>
								<div class="sender-name">{{ message.senderNickname }}</div>
							</div>

							<!-- 메시지 내용 -->
							<div class="chat__message">
								<div class="item__wrap">
									<div
										class="item__message"
										:class="{
											'system-message': isSystemMessage(message),
										}"
									>
										<p class="text">{{ message.content }}</p>
									</div>
								</div>
								<div class="item__fnc" v-if="!isSystemMessage(message)">
									<p class="list__item past">
										<i class="blind">채팅 전송시간</i>
										<span class="item__count">{{
											formatTime(message.sentAt)
										}}</span>
									</p>
								</div>
							</div>
						</li>
					</template>
				</ul>
			</div>

			<!-- 채팅 입력 -->
			<div class="chat__write">
				<div class="chat__inner">
					<div class="item__textarea">
						<textarea
							v-model="messageContent"
							class="text__area"
							name="content"
							autocomplete="off"
							placeholder="메시지를 입력하세요."
							ref="messageTextarea"
							@input="adjustTextareaHeight"
							@keypress.enter.prevent="sendMessage"
							rows="1"
						></textarea>
					</div>
					<div class="item__fnc">
						<button
							type="button"
							class="button-icon__s button--send"
							:class="{ active: messageContent.trim() !== '' }"
							@click="sendMessage"
							:disabled="!wsConnected"
						>
							<svg viewBox="0 0 16 16">
								<path :d="chatSendingIcon" />
							</svg>
							<i class="blind">채팅보내기</i>
						</button>
					</div>
				</div>
			</div>
		</div>
		<SideMenu @close="offSideMenu" v-if="isSideMenu" />
	</div>

		<!-- 로딩 상태 -->
		<div class="loading" v-if="loading">
			<p>채팅방을 불러오는 중...</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import { chatSendingIcon } from '@/shared/utils/icons';
import type { IChatRoom, IChatMessage } from '@/features/chat/types/index';
import { ChatService } from '@/features/chat/services/chatService';
import { WebSocketService } from '@/features/chat/services/webSocketService';
import SideMenu from '@/shared/components/common/SideMenu.vue';
import { countryCodeToFlagCode } from '@/shared/utils/flagMapping';

// Props 정의 (Vue warning 해결)
const props = defineProps<{
	chatRoomId?: string;
}>();

const userInfo = useUserInfoStore();
const router = useRouter();
const route = useRoute();

// 상태 관리
const chatRoom = ref<IChatRoom | null>(null);
const messages = ref<IChatMessage[]>([]);
const messageContent = ref('');
const loading = ref(false);
const wsConnected = ref(false);

// UI 상태
const isSideMenu = ref(false);
const chatContent = ref<HTMLElement>();
const messageTextarea = ref<HTMLTextAreaElement>();

// WebSocket 서비스
let webSocketService: WebSocketService | null = null;

// 채팅방 ID
const chatRoomId = route.params.chatRoomId as string;

// 이전 메시지와 날짜가 다른지 체크
let lastMessageDate: string | null = null;

// 뒤로가기
const previousComponent = () => {
	// 채팅방 목록 새로고침 플래그 설정
	localStorage.setItem('refreshChatRooms', 'true');
	router.back();
};

// 사이드 메뉴
const onSideMenu = () => {
	isSideMenu.value = true;
};

const offSideMenu = () => {
	isSideMenu.value = false;
};

// 채팅방 정보 로드
const loadChatRoom = async () => {
	if (!userInfo.accessToken) {
		console.error('No access token available');
		router.push('/sign-in');
		return;
	}

	try {
		loading.value = true;
		chatRoom.value = await ChatService.getChatRoom(
			chatRoomId,
			userInfo.accessToken,
		);

		if (!chatRoom.value) {
			alert('채팅방을 찾을 수 없습니다.');
			router.back();
			return;
		}

		await loadMessages();
	} catch (error) {
		console.error('Failed to load chat room:', error);
		alert('채팅방을 불러오는데 실패했습니다.');
		router.back();
	} finally {
		loading.value = false;
	}
};

// 메시지 목록 로드
const loadMessages = async () => {
	if (!userInfo.accessToken) {
		console.error('No access token available');
		return;
	}

	try {
		const recentMessages = await ChatService.getRecentMessages(
			chatRoomId,
			userInfo.accessToken,
		);
		messages.value = recentMessages.sort(
			(a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
		);

		nextTick(() => {
			scrollToBottom();
			markAllMessagesAsRead(); // 메시지 로드 후 읽음 처리
		});
	} catch (error) {
		console.error('Failed to load messages:', error);
	}
};

// WebSocket 연결
const connectWebSocket = async () => {
	try {
		webSocketService = new WebSocketService();
		await webSocketService.connect(chatRoomId, (message: IChatMessage) => {
			console.log('Received message via WebSocket:', message);
			
			// 중복 메시지 방지 - 같은 내용과 시간의 메시지가 이미 있으면 추가하지 않음
			const isDuplicate = messages.value.some(existing => 
				existing.senderId === message.senderId &&
				existing.content === message.content &&
				Math.abs(new Date(existing.sentAt).getTime() - new Date(message.sentAt).getTime()) < 5000 // 5초 내
			);
			
			if (!isDuplicate) {
				messages.value.push(message);
				console.log('Added WebSocket message to list');
				
				// 새 메시지가 다른 사용자의 것이면 읽음 처리
				if (message.senderId !== userInfo.userId) {
					markMessageAsRead(message.id);
				}
			} else {
				console.log('Duplicate message detected, skipping');
			}
			
			nextTick(() => {
				scrollToBottom();
			});
		});
		wsConnected.value = true;
		console.log('WebSocket connected successfully, wsConnected set to true');

		// 채팅방 참여 알림 제거 - 매번 "참가했습니다" 메시지가 나오는 것을 방지
		// if (chatRoom.value && userInfo.userId) {
		// 	console.log('Sending join notification for user:', userInfo.userId);
		// 	webSocketService.joinChatRoom(
		// 		userInfo.userId,
		// 		userInfo.userNickname || userInfo.userId || 'Anonymous',
		// 	);
		// }
	} catch (error) {
		console.error('Failed to connect WebSocket:', error);
		wsConnected.value = false;
	}
};

// WebSocket 연결 해제
const disconnectWebSocket = () => {
	if (webSocketService) {
		// 채팅방에서 완전히 나가는 게 아니라 단순히 연결만 정리
		// leaveChatRoom 호출 제거 - 나중에 다시 들어올 수 있도록 함
		webSocketService.disconnect();
		wsConnected.value = false;
	}
};

// 메시지 전송
const sendMessage = () => {
	console.log('sendMessage called');
	console.log('messageContent:', messageContent.value);
	console.log('webSocketService:', webSocketService);
	console.log('wsConnected:', wsConnected.value);
	console.log('userInfo.userId:', userInfo.userId);
	
	if (
		!messageContent.value.trim() ||
		!webSocketService ||
		!wsConnected.value ||
		!userInfo.userId
	) {
		console.log('sendMessage: early return due to missing requirements');
		return;
	}

	console.log('Sending message via WebSocket...');
	
	const messageText = messageContent.value.trim();
	webSocketService.sendMessage(
		userInfo.userId,
		userInfo.userNickname || userInfo.userId || 'Anonymous',
		messageText,
	);

	// 백엔드에서 메시지를 다시 브로드캐스트하지 않는 경우를 위한 임시 해결책
	// 본인이 보낸 메시지를 로컬에서 바로 추가
	const localMessage = {
		id: Date.now().toString(), // 임시 ID
		senderId: userInfo.userId,
		senderNickname: userInfo.userNickname || userInfo.userId || 'Anonymous',
		content: messageText,
		sentAt: new Date().toISOString(),
		type: 'MESSAGE'
	};
	
	messages.value.push(localMessage);
	console.log('Added message locally:', localMessage);
	
	messageContent.value = '';
	resetTextareaHeight();
	
	nextTick(() => {
		scrollToBottom();
	});
	
	console.log('Message sent successfully');
};

// 텍스트영역 높이 조절
const adjustTextareaHeight = () => {
	const textarea = messageTextarea.value;
	if (textarea) {
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}
};

const resetTextareaHeight = () => {
	const textarea = messageTextarea.value;
	if (textarea) {
		textarea.style.height = '';
	}
};

// 스크롤을 맨 아래로
const scrollToBottom = () => {
	const pageHeight = document.documentElement.scrollHeight;
	window.scrollTo(0, pageHeight);
};

// 메시지 관련 헬퍼 함수들
const isMyMessage = (message: IChatMessage): boolean => {
	return message.senderId === userInfo.userId;
};

const isSystemMessage = (message: IChatMessage): boolean => {
	return (
		message.messageType === 'SYSTEM_JOIN' ||
		message.messageType === 'SYSTEM_LEAVE'
	);
};

const shouldShowDateSeparator = (message: IChatMessage): boolean => {
	const messageDate = formatDateSeparator(message.sentAt);
	if (messageDate !== lastMessageDate) {
		lastMessageDate = messageDate;
		return true;
	}
	return false;
};

const formatDateSeparator = (dateString: string): string => {
	const date = new Date(dateString);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return '오늘';
	} else if (date.toDateString() === yesterday.toDateString()) {
		return '어제';
	} else {
		const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
		const day = weekdays[date.getDay()];
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const dayOfMonth = String(date.getDate()).padStart(2, '0');
		return `${year}/${month}/${dayOfMonth} (${day})`;
	}
};

const formatTime = (dateString: string): string => {
	const date = new Date(dateString);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
};

// 국기 코드 가져오기
const getFlagCode = (countryCode: string): string => {
	return countryCodeToFlagCode(countryCode);
};

// 특정 메시지 읽음 처리
const markMessageAsRead = async (messageId: string) => {
	if (!webSocketService || !userInfo.userId || !userInfo.accessToken) {
		return;
	}

	try {
		// WebSocket으로 읽음 상태 전송
		webSocketService.markMessageAsRead(
			userInfo.userId,
			userInfo.userNickname || userInfo.userId || 'Anonymous',
			messageId
		);
	} catch (error) {
		console.error('Failed to mark message as read:', error);
	}
};

// 모든 메시지 읽음 처리
const markAllMessagesAsRead = async () => {
	if (!userInfo.userId || !userInfo.accessToken || !chatRoomId) {
		return;
	}

	try {
		// API로 모든 메시지 읽음 처리
		await ChatService.markAllMessagesAsRead(
			chatRoomId,
			userInfo.userId,
			userInfo.accessToken
		);
		console.log('Marked all messages as read');
	} catch (error) {
		console.error('Failed to mark all messages as read:', error);
	}
};

// 페이지 포커스 시 읽음 처리
const handlePageFocus = () => {
	markAllMessagesAsRead();
};

// 컴포넌트 마운트/언마운트
onMounted(async () => {
	if (!userInfo.accessToken || !userInfo.userId) {
		router.push('/sign-in');
		return;
	}

	await loadChatRoom();
	await connectWebSocket();
	
	// 페이지 포커스 이벤트 리스너 추가
	window.addEventListener('focus', handlePageFocus);
});

onUnmounted(() => {
	disconnectWebSocket();
	// 페이지 포커스 이벤트 리스너 제거
	window.removeEventListener('focus', handlePageFocus);
});
</script>

<style scoped>
.participant-count {
	font-size: 0.8em;
	color: #666;
	margin-left: 0.5rem;
}

.sender-name {
	font-size: 0.8em;
	color: #666;
	margin-top: 0.2rem;
}

.user-avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: #007bff;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	font-size: 0.9em;
}

.item._system {
	text-align: center;
	margin: 1rem 0;
}

.system-message {
	background: #f0f0f0 !important;
	color: #666 !important;
	font-style: italic;
	text-align: center;
	border-radius: 12px !important;
	padding: 0.5rem 1rem;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50vh;
	color: #666;
}

.button--send:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

/* 채팅방 헤더 스타일 */
.chat-room-header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.header-flag-icon {
	width: 1.5em;
	height: 1.1em;
	border-radius: 3px;
}

.header-custom-flag {
	font-size: 1.2em;
}
</style>
