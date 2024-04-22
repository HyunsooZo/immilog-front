<template>
	<header class="header _bg" v-if="chats.length > 0">
		<div class="item__fnc">
			<button type="button" class="button-icon button--back" role="link" @click="previousComponent">
				<i class="blind">이전화면</i>
			</button>
		</div>
		<div class="title">
			<p class="list__item user">
				<strong>{{ amISender(chats[0].sender.seq) ? chats[0].recipient.nickName : chats[0].sender.nickName }}
				</strong>
			</p>
		</div>
		<div class="item__fnc">
			<button class="button-icon button--menu" role="link" @click="onSideMenu">
				<i class="blind">메뉴</i>
			</button>
		</div>
	</header>
	<div class="content _full" v-if="chats.length > 0">
		<div class="chat-wrap">
			<!-- message -->
			<div class="chat__msg" v-if="chats.length == 0">
				<p class="text">
					<em class="user__name">
						{{ amISender(chats[0].sender.seq) ? chats[0].recipient.nickName : chats[0].sender.nickName }}
					</em>님과의 채팅을 시작해보세요.
				</p>
			</div>
			<!-- chat list -->
			<div class="chat__content">
				<ul class="chat__list">
					<template v-for="chat in chats" :key="chat.id">
						<li class="item__notice" v-if="lastDate !== formDate(chat.createdAt)">
							<span class="text">{{ getDateTime(chat.createdAt) }}</span>
						</li>
						<li :id="`message-${chat.id}`" class="item" aria-label="받은 메시지" data-content-type="text"
							:class="{ _my: amISender(chat.sender.seq), }">
							<!-- 사용자 정보 -->
							<div class="info__wrap" v-if="!amISender(chat.sender.seq)">
								<button type="button" class="item__pic" :class="{ 'pic--default': chat.sender.profileImage === '', }"
									@click="onUserProfileDetail">
									<img :src="chat.sender.profileImage" alt=""
										v-if="chat.sender.profileImage !== ''" /></button><!-- // 사용자 프로필 보기 -->
							</div>
							<div class="chat__message">
								<div class="item__wrap">
									<div class="item__message">
										<p class="text">{{ chat.content }}</p>
									</div>
								</div>
								<div class="item__fnc">
									<p class="list__item read" :class="{ active: isRead(chat.id) }">
										<i class="blind">채팅 읽음 여부</i>
										<span class="item__count" v-if="amISender(chat.sender.seq)">
											<!-- {{ isRead(chat.id) ? '읽음 ' : '안 읽음 ' }} -->
											<svg viewBox="0 0 16 16">
												<path
													d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
											</svg>
										</span>
										<!-- <span class="item__count" v-if="amISender(chat.sender.seq)">
											{{ isRead(chat.id) ? '읽음 ' : '안 읽음 ' }}</span> -->
									</p>
									<p class="list__item past">
										<i class="blind">채팅 전송시간</i>
										<span class="item__count">
											{{ formTime(chat.createdAt) }}</span>
									</p>
								</div>
							</div>
						</li>
					</template>
				</ul>
			</div>
			<!-- chat write -->
			<div class="chat__write">
				<chat-image-preview :chatImages="chatImages" v-if="hasChatImageAttached" @removeImage="deleteChatImage" />
				<div class="chat__inner">
					<div class="input__wrap input__attachments">
						<div class="input__file">
							<input type="file" id="file-upload" multiple
								accept="image/jpeg, image/png, image/gif, image/jpg, image/tiff" @change="previewImage" />

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
						<textarea v-model="content" class="text__area" name="content" autocomplete="off" placeholder="메시지를 입력하세요."
							data-autosuggest_is-input="true" ref="adjustTextarea" @input="adjustTextareaHeight" rows="1"></textarea>
					</div>
					<div class="item__fnc">
						<button type="button" class="button-icon__s button--send" :class="{ active: content.trim() !== '', }"
							@click="sendMessage">
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
	<UserProfileDetail @close="offUserProfileDetail" v-if="isUserProfileDetailOn" />
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert :alertValue="alertValue" :alertText="alertText" @update:alertValue="closeAlert" />
	</teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { imageSelectIcon, chatSendingIcon } from '@/utils/icons.ts';
import type { IApiChat } from '@/types/api-interface';
import type { IChat } from '@/types/interface';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { applicationJsonWithToken } from '@/utils/header';
import axios, { AxiosResponse } from 'axios';
import SideMenu from '@/components/settings/SideMenu.vue';
import UserProfileDetail from '@/components/board/UserProfileDetail.vue';
import ChatImagePreview from '@/components/chat/ChatImagePreview.vue';
import CustomAlert from '@/components/modal/CustomAlert.vue';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const userInfo = useUserInfoStore();
const router = useRouter();
const route = useRoute();
const server = import.meta.env.VITE_APP_API_URL.replace('/api/v1', '');

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

// 프로필 보기
const isUserProfileDetailOn = ref(false);
const onUserProfileDetail = () => {
	isUserProfileDetailOn.value = true;
	modalOpenClass();
};
const offUserProfileDetail = () => {
	isUserProfileDetailOn.value = false;
	modalCloseClass();
};

// 웹소켓 관련 변수
const socket = new SockJS(server + '/ws');
const stompClient = Stomp.over(socket);

// 채팅 컨텐츠 및 페이지 관련 변수
const content = ref('');
const pageable = ref({});
const page = ref(0);
let lastDate: string | null = null;

// 채팅방 번호
const chatRoomSeq = ref(route.params.chatRoomId);

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
		const response: AxiosResponse<IApiChat> = await axios.get(
			`/chat/rooms/${chatRoomSeq.value}?page=${page.value}`,
			applicationJsonWithToken
		);
		if (response.status === 200) {
			response.data.data.content.forEach((chat: IChat) => chats.value.push(chat));
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
		stompClient.subscribe(`/topic/room/${chatRoomSeq.value}`, message => {
			const newMessage = JSON.parse(message.body);
			chats.value.push(newMessage);
			nextTick(() => {
				scrollToBottom();
				if (!amISender(newMessage.sender.seq)) {
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
const updateReadStatus = (readChatInfo: { chatSeq: any; }) => {
	chats.value.forEach(chat => {
		if (chat.id === readChatInfo.chatSeq) {
			chat.readStatus = true;
		}
	});
};
// 메세지가 읽혔는지 체크 
const isRead = (chatId: number): boolean => {
	const chat = chats.value.find((chat: IChat) => chat.id === chatId);
	return chat ? chat.readStatus : false;
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
			console.log('Disconnected');
		});
	}
	window.removeEventListener('scroll', handleScroll);
});


// 사용자가 채팅 발신자인지 확인
const amISender = (senderSeq: number) => {
	return senderSeq === userInfo.userSeq;
};

// 날짜 가져오기
const getDateTime = (dateTime: any) => {
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
			chatRoomSeq: chatRoomSeq.value,
			senderSeq: userInfo.userSeq,
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
				chatSeq: id,
				userSeq: userInfo.userSeq,
			}),
		);
	} else {
		// 모든 메시지를 '읽음'으로 표시
		chats.value.forEach((chat: IChat) => {
			if (!amISender(chat.sender.seq) && !chat.readStatus) {
				// 읽음 상태를 서버에 보내기
				stompClient.send(
					'/app/chat/read',
					{},
					JSON.stringify({
						chatSeq: chat.id,
						userSeq: userInfo.userSeq,
					}),
				);
				// 프론트엔드에서 상태 업데이트
				chat.readStatus = true;
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
			`message-${chats.value[chats.value.length - messageLenth.value].id}`,
		);
		if (messageElement) {
			window.scrollTo(0, messageElement.offsetTop - 100);
		}
	}
};

// <-- 첨부파일 관련
const chatImages = ref<string[]>([]);

// 이미지 미리보기
const previewImage = (event: any) => {
	if (chatImages.value.length >= 3) {
		openAlert('사진은 최대 3개 까지만 전송 할 수 있습니다.');
		return;
	}
	const file = event.target.files[0];
	const reader = new FileReader();
	reader.onload = () => {
		chatImages.value.push(reader.result as string);
	};
	reader.readAsDataURL(file);
};

// 프리뷰 삭제
const deleteChatImage = (index: number) => {
	chatImages.value = [
		...Array.from(chatImages.value).slice(0, index),
		...Array.from(chatImages.value).slice(index + 1)
	];
}
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
