<template>
	<header class="header _bg" v-if="chats.length > 0">
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
				<strong
					>{{
						amISender(chats[0].sender.userId)
							? chats[0].recipient.nickname
							: chats[0].sender.nickname
					}}
				</strong>
			</p>
		</div>
		<div class="item__fnc">
			<button class="button-icon button--menu" @click="onSideMenu">
				<i class="blind">메뉴</i>
			</button>
		</div>
	</header>
	<div class="content _full" v-if="chats?.length > 0">
		<div class="chat-wrap">
			<!-- message -->
			<div class="chat__msg" v-if="chats?.length == 0">
				<p class="text">
					<em class="user__name">
						{{
							amISender(chats[0]?.sender.userId)
								? chats[0].recipient.nickname
								: chats[0].sender.nickname
						}} </em
					>님과의 채팅을 시작해보세요.
				</p>
			</div>
			<!-- chat list -->
			<div class="chat__content">
				<ul class="chat__list">
					<template v-for="chat in chats" :key="chat.chatId">
						<li
							class="item__notice"
							v-if="lastDate !== formDate(chat.createdAt)"
						>
							<span class="text">{{ getDateTime(chat.createdAt) }}</span>
						</li>
						<li
							:id="`message-${chat.chatId}`"
							class="item"
							aria-label="받은 메시지"
							data-content-type="text"
							:class="{ _my: amISender(chat.sender.userId) }"
						>
							<!-- 사용자 정보 -->
							<div class="info__wrap" v-if="!amISender(chat.sender.userId)">
								<button
									type="button"
									class="item__image"
									:class="{
										'image--default': chat.sender.userProfileUrl === '',
									}"
									@click="onUserProfileDetail"
								>
									<img
										:src="chat.sender.userProfileUrl"
										alt=""
										v-if="chat.sender.userProfileUrl !== ''"
									/></button
								><!-- // 사용자 프로필 보기 -->
							</div>
							<div class="chat__message">
								<div class="item__wrap">
									<div class="item__message">
										<p class="text">{{ chat.content }}</p>
									</div>
								</div>
								<div class="item__fnc">
									<p
										class="list__item read"
										:class="{ active: isRead(chat.chatId) }"
									>
										<i class="blind">채팅 읽음 여부</i>
										<span
											class="item__count"
											v-if="amISender(chat.sender.userId)"
										>
											<!-- {{ isRead(chat.chatId) ? '읽음 ' : '안 읽음 ' }} -->
											<svg viewBox="0 0 16 16">
												<path
													d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"
												/>
											</svg>
										</span>
										<!-- <span class="item__count" v-if="amISender(chat.sender.userId)">
											{{ isRead(chat.chatId) ? '읽음 ' : '안 읽음 ' }}</span> -->
									</p>
									<p class="list__item past">
										<i class="blind">채팅 전송시간</i>
										<span class="item__count">
											{{ formTime(chat.createdAt) }}</span
										>
									</p>
								</div>
							</div>
						</li>
					</template>
				</ul>
			</div>
			<!-- chat write -->
			<div class="chat__write">
				<chat-image-preview
					:chatImages="chatImages"
					v-if="hasChatImageAttached"
					@removeImage="deleteChatImage"
				/>
				<div class="chat__inner">
					<div class="input__wrap input__attachments">
						<div class="input__file">
							<input
								type="file"
								id="file-upload"
								multiple
								accept="image/jpeg, image/png, image/gif, image/jpg, image/tiff"
								@change="previewImage"
							/>

							<label for="file-upload" class="button-icon__s" role="button">
								<svg viewBox="0 0 16 16">
									<path :d="imageSelectIcon.first" />
									<path :d="imageSelectIcon.second" />
								</svg>
								<i class="blind">사진 선택</i>
							</label>
						</div>
					</div>
					<div class="item__textarea">
						<!-- //.inactive :textarea disabled placeholder="회원 신고로 인해 이용이 제한됩니다." -->
						<textarea
							v-model="content"
							class="text__area"
							name="content"
							autocomplete="off"
							placeholder="메시지를 입력하세요."
							data-autosuggest_is-input="true"
							ref="adjustTextarea"
							@input="adjustTextareaHeight"
							rows="1"
						></textarea>
					</div>
					<div class="item__fnc">
						<button
							type="button"
							class="button-icon__s button--send"
							:class="{ active: content.trim() !== '' }"
							@click="sendMessage"
						>
							<!-- 전송 버튼 아이콘 -->
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
	<UserProfileDetail
		@close="offUserProfileDetail"
		v-if="isUserProfileDetailOn"
	/>
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert
			:alertValue="alertValue"
			:alertText="alertText"
			@update:alertValue="closeAlert"
		/>
	</teleport>
</template>

<script setup lang="ts">
import type { IApiChat } from '@/features/chat/types/index';
import type { IChat } from '@/shared/types/common';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useUserInfoStore } from '@/features/auth/stores/userInfo';
import { imageSelectIcon, chatSendingIcon } from '@/shared/utils/icons';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { applicationJsonWithToken, webSocketURL } from '@/shared/utils/header';
import { AxiosResponse } from 'axios';
import SideMenu from '@/shared/components/common/SideMenu.vue';
import UserProfileDetail from '@/features/user/components/UserProfileDetail.vue';
import ChatImagePreview from '@/features/chat/components/ChatImagePreview.vue';
import CustomAlert from '@/shared/components/ui/CustomAlert.vue';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import api from '@/core/api/index';

const userInfo = useUserInfoStore();
const router = useRouter();
const route = useRoute();

// modal open/close 시 body 컨트롤
const isModalOpen = () => {
	document.body.classList.add('inactive');
};
const isModalClose = () => {
	document.body.classList.remove('inactive');
};

// 프로필 보기
const isUserProfileDetailOn = ref(false);
const onUserProfileDetail = () => {
	isUserProfileDetailOn.value = true;
	isModalOpen();
};
const offUserProfileDetail = () => {
	isUserProfileDetailOn.value = false;
	isModalClose();
};

// 웹소켓 관련 변수
const socket = new SockJS(webSocketURL + '/ws');
const stompClient = Stomp.over(socket);

// 채팅 컨텐츠 및 페이지 관련 변수
const content = ref('');
const pageable = ref({});
const page = ref(0);
let lastDate: string | null = null;

// 채팅방 번호
const chatRoomId = ref(route.params.chatRoomId);

// 뒤로가기
const previousComponent = () => {
	router.back();
};

// 사이드 메뉴 관련 변수 및 메서드
const isSideMenu = ref(false);
const onSideMenu = () => {
	isSideMenu.value = true;
};
const offSideMenu = () => {
	isSideMenu.value = false;
};

// 텍스트 영역 조절
const adjustTextarea = ref(null);
const adjustTextareaHeight = () => {
	const textarea = adjustTextarea.value as unknown as HTMLTextAreaElement;
	if (textarea) {
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}
};

// textarea 높이 초기화 함수
const resetTextareaHeight = () => {
	const textarea = adjustTextarea.value as HTMLTextAreaElement | null;
	if (textarea) {
		textarea.style.height = '';
	}
};

// 채팅 내용을 담는 배열
const chats = ref<IChat[]>([]);
const isLoading = ref(false);
// db에 저장된 채팅 내용을 가져오는 함수
const fetchChats = async () => {
	if (isLoading.value) {
		return;
	}
	try {
		isLoading.value = true;
		const response: AxiosResponse<IApiChat> = await api.get(
			`/chat/rooms/${chatRoomId.value}?page=${page.value}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			response.data.data.content.forEach((chat: IChat) =>
				chats.value.push(chat),
			);
			chats.value.sort((a, b) => {
				const dateA = new Date(a.createdAt);
				const dateB = new Date(b.createdAt);
				return dateA.getTime() - dateB.getTime();
			});
			pageable.value = response.data.data.pageable;
			page.value = page.value + 1;
		}
	} catch (error) {
		console.error('error: ', error);
	} finally {
		nextTick(() => {
			if (page.value == 0) {
				scrollToBottom();
			}
			setTimeout(() => {
				isLoading.value = false;
			}, 2000);
		});
	}
};

// 웹소켓 연결 및 구독 설정
const connectWebSocket = () => {
	stompClient.connect({}, () => {
		stompClient.subscribe(`/topic/room/${chatRoomId.value}`, message => {
			const newMessage = JSON.parse(message.body);
			chats.value.push(newMessage);
			nextTick(() => {
				scrollToBottom();
				if (!amISender(newMessage.sender.userId)) {
					markMessagesAsRead(newMessage.id);
				}
			});
		});
		// 메시지 읽음 상태 업데이트 구독
		stompClient.subscribe(`/topic/readChat`, message => {
			const readChatInfo = JSON.parse(message.body);
			updateReadStatus(readChatInfo);
		});
	});
};

// 메시지 읽음 상태를 업데이트하는 함수
const updateReadStatus = (readChatInfo: { chatId: string }) => {
	chats.value.forEach(chat => {
		if (chat.chatId === readChatInfo.chatId) {
			chat.isRead = true;
		}
	});
};
// 메세지가 읽혔는지 체크
const isRead = (chatId: string): boolean => {
	const chat = chats.value.find((chat: IChat) => chat.chatId === chatId);
	return chat ? chat.isRead : false;
};

// 스크롤 이벤트 리스너를 추가하는 함수
const setupScrollListener = () => {
	window.addEventListener('scroll', handleScroll);
};

// 스크롤 이벤트 핸들러
const handleScroll = async () => {
	if (window.scrollY === 0 && !isLoading.value) {
		saveFirstMessage();
		const currentSize = chats.value.length;
		await fetchChats();
		moveToFirstMessage(currentSize);
	}
};

// 화면 마운트
onMounted(async () => {
	connectWebSocket();
	await fetchChats();
	setupScrollListener();
	nextTick(() => {
		scrollToBottom();
	});
});

onUnmounted(() => {
	if (stompClient && stompClient.connected) {
		stompClient.disconnect(() => {
			// WebSocket 연결 해제됨
		});
	}
	window.removeEventListener('scroll', handleScroll);
});

// 사용자가 채팅 발신자인지 확인
const amISender = (senderId: string) => {
	return senderId === userInfo.userId;
};

// 날짜 가져오기
const getDateTime = (dateTime: string | number | Date) => {
	const result = formDate(dateTime);
	lastDate = result;
	return result;
};

// 날짜 리포맷팅
const formDate = (dateTime: string | number | Date) => {
	const date = new Date(dateTime);
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const day = weekdays[date.getDay()];

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const dayOfMonth = String(date.getDate()).padStart(2, '0');
	return `${year}/${month}/${dayOfMonth} (${day})`;
};

// 시간 리포맷팅
const formTime = (dateTime: string | number | Date) => {
	const date = new Date(dateTime);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	// 같다면 시간 부분만 반환
	return `${hours}:${minutes}`;
};

// 메시지 전송
const sendMessage = () => {
	if (content.value.trim()) {
		const messageToSend = {
			chatRoomId: chatRoomId.value,
			senderId: userInfo.userId,
			content: content.value,
			attachments: [],
		};
		stompClient.send('/app/chat/send', {}, JSON.stringify(messageToSend));
		content.value = '';
		resetTextareaHeight();
	}
};

// 채팅방에 들어갔을 때 '읽음' 상태를 서버에 보내는 함수
const markMessagesAsRead = (id: number) => {
	if (id) {
		stompClient.send(
			'/app/chat/read',
			{},
			JSON.stringify({
				chatId: id,
				userId: userInfo.userId,
			}),
		);
	} else {
		// 모든 메시지를 '읽음'으로 표시
		chats.value.forEach((chat: IChat) => {
			if (!amISender(chat.sender.userId) && !chat.isRead) {
				// 읽음 상태를 서버에 보내기
				stompClient.send(
					'/app/chat/read',
					{},
					JSON.stringify({
						chatId: chat.chatId,
						userId: userInfo.userId,
					}),
				);
				// 프론트엔드에서 상태 업데이트
				chat.isRead = true;
			}
		});
	}
};

// 스크롤을 맨 아래로 내리는 함수
const scrollToBottom = () => {
	const pageHeight = document.documentElement.scrollHeight;
	window.scrollTo(0, pageHeight);
};

const messageLenth = ref(0);

// 로드 전 첫 채팅메세지 위치 기억하는 함수
const saveFirstMessage = () => {
	messageLenth.value = chats.value.length;
};

const moveToFirstMessage = (currentSize: number) => {
	if (currentSize < chats.value.length) {
		const messageElement = document.getElementById(
			`message-${chats.value[chats.value.length - messageLenth.value].chatId}`,
		);
		if (messageElement) {
			window.scrollTo(0, messageElement.offsetTop - 100);
		}
	}
};

// <-- 첨부파일 관련
const chatImages = ref<string[]>([]);

// 이미지 미리보기
const previewImage = (event: Event) => {
	if (chatImages.value.length >= 3) {
		openAlert('사진은 최대 3개 까지만 전송 할 수 있습니다.');
		return;
	}

	const target = event.target as HTMLInputElement;

	if (target.files && target.files.length > 0) {
		const file = target.files[0];
		const reader = new FileReader();

		reader.onload = () => {
			chatImages.value.push(reader.result as string);
		};

		reader.readAsDataURL(file);
	}
};

// 프리뷰 삭제
const deleteChatImage = (index: number) => {
	chatImages.value = [
		...Array.from(chatImages.value).slice(0, index),
		...Array.from(chatImages.value).slice(index + 1),
	];
};
// 이미지 첨부 여부
const hasChatImageAttached = computed(() => {
	return chatImages.value.length > 0;
});
// -->

// <-- 알럿 관련
const alertValue = ref(false);
const alertText = ref('');

const openAlert = (content: string) => {
	alertValue.value = true;
	alertText.value = content;
};

const closeAlert = () => {
	alertValue.value = false;
};
// -->
</script>
