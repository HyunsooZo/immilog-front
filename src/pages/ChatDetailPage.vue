<template>
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
			<p class="list__item user">
				<strong>{{ chatRoom.name }}</strong>
				<span class="participant-count">{{ chatRoom.participantCount }}명</span>
			</p>
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
			messages.value.push(message);
			nextTick(() => {
				scrollToBottom();
			});
		});
		wsConnected.value = true;

		// 채팅방 참여 알림
		if (chatRoom.value && userInfo.userId) {
			webSocketService.joinChatRoom(
				userInfo.userId,
				userInfo.userNickname || userInfo.userId || 'Anonymous',
			);
		}
	} catch (error) {
		console.error('Failed to connect WebSocket:', error);
		wsConnected.value = false;
	}
};

// WebSocket 연결 해제
const disconnectWebSocket = () => {
	if (webSocketService) {
		// 채팅방 퇴장 알림
		if (chatRoom.value && userInfo.userId) {
			webSocketService.leaveChatRoom(
				userInfo.userId,
				userInfo.userNickname || userInfo.userId || 'Anonymous',
			);
		}

		webSocketService.disconnect();
		wsConnected.value = false;
	}
};

// 메시지 전송
const sendMessage = () => {
	if (
		!messageContent.value.trim() ||
		!webSocketService ||
		!wsConnected.value ||
		!userInfo.userId
	) {
		return;
	}

	webSocketService.sendMessage(
		userInfo.userId,
		userInfo.userNickname || userInfo.userId || 'Anonymous',
		messageContent.value.trim(),
	);

	messageContent.value = '';
	resetTextareaHeight();
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

// 컴포넌트 마운트/언마운트
onMounted(async () => {
	if (!userInfo.accessToken || !userInfo.userId) {
		router.push('/sign-in');
		return;
	}

	await loadChatRoom();
	await connectWebSocket();
});

onUnmounted(() => {
	disconnectWebSocket();
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
</style>
