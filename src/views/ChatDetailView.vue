<template>
	<header class="header _bg" v-if="chats.length > 0">
		<div class="item__fnc">
			<button
				type="button"
				class="button-icon button--back"
				role="link"
				@click="previousComponent"
			>
				<i class="blind">이전화면</i>
			</button>
		</div>
		<div class="title">
			<p class="list__item user">
				<strong
					>{{
						amISender(chats[0].sender.seq)
							? chats[0].recipient.nickName
							: chats[0].sender.nickName
					}}
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
						{{
							amISender(chats[0].sender.seq)
								? chats[0].recipient.nickName
								: chats[0].sender.nickName
						}} </em
					>님과의 채팅을 시작해보세요.
				</p>
			</div>
			<!-- chat list -->
			<div class="chat__content">
				<ul class="chat__list">
					<template v-for="chat in chats" :key="chat.id">
						<li
							class="item__notice"
							v-if="lastDate !== formDate(chat.createdAt)"
						>
							<span class="text">{{ getDateTime(chat.createdAt) }}</span>
						</li>
						<li
							class="item"
							aria-label="받은 메시지"
							data-content-type="text"
							:class="{
								_my: amISender(chat.sender.seq),
							}"
						>
							<!-- 사용자 정보 -->
							<div class="info__wrap" v-if="!amISender(chat.sender.seq)">
								<button
									type="button"
									class="item__pic"
									:class="{
										'pic--default': chat.sender.profileImage === '',
									}"
								>
									<img
										:src="chat.sender.profileImage"
										alt=""
										v-if="chat.sender.profileImage !== ''"
									/></button
								><!-- // 사용자 프로필 보기 -->
							</div>
							<div class="chat__message">
								<div class="item__message">
									<p class="text">{{ chat.content }}</p>
								</div>
								<div class="item__fnc">
									<p class="list__item past">
										<i class="blind">{{ chat.createdAt }}</i>

										<span class="item__count" v-if="amISender(chat.sender.seq)">
											{{ isRead(chat.id) ? '읽음 ' : '안 읽음 ' }}</span
										>
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
				<div class="chat__inner">
					<div class="input__wrap input__attachments">
						<div class="input__file">
							<input
								type="file"
								id="file-upload"
								multiple="multiple"
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
						>
						</textarea>
					</div>
					<div class="item__fnc">
						<button
							type="button"
							class="button-icon__s button--send"
							:class="{
								active: content.trim() !== '',
							}"
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import SideMenu from '@/components/settings/SideMenu.vue';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import useAxios from '@/composables/useAxios';
import { useUserInfoStore } from '@/stores/userInfo';
import { imageSelectIcon, chatSendingIcon } from '@/utils/icons.js';

const userInfo = useUserInfoStore();
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const { sendRequest } = useAxios(router);
const server = import.meta.env.VITE_APP_API_URL.replace('/api/v1', '');

// 웹소켓 관련 변수
const socket = new SockJS(server + '/ws');
const stompClient = Stomp.over(socket);

// 채팅 컨텐츠 및 페이지 관련 변수
const content = ref('');
const pageable = ref({});
const page = ref(0);
let lastDate = null;

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
	const textarea = adjustTextarea.value;
	textarea.style.height = 'auto';
	textarea.style.height = `${textarea.scrollHeight}px`;
};

// textarea 높이 초기화 함수
const resetTextareaHeight = () => {
	if (adjustTextarea.value) {
		adjustTextarea.value.style.height = null;
	}
};

// 채팅 내용을 담는 배열
const chats = ref([]);

const isLoading = ref(false);
// db에 저장된 채팅 내용을 가져오는 함수
const fetchChats = async () => {
	if (isLoading.value) {
		return;
	}
	try {
		isLoading.value = true;
		const { status, data } = await sendRequest(
			'get',
			`/chat/rooms/${chatRoomSeq.value}?page=${page.value}`,
			{
				headers: {
					contentType: 'application/json',
					Authorization: `Bearer ${userInfo.accessToken}`,
				},
			},
			null,
		);
		if (status === 200) {
			data.data.content.forEach(chat => chats.value.push(chat));
			chats.value.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
			data.data.pageable = pageable.value;
			page.value = page.value + 1;
		}
	} catch (error) {
		console.error('error: ', error);
	} finally {
		nextTick(() => {
			if (page.value == 0) {
				scrollToBottom();
			} else {
				// scrollToLower();
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
const updateReadStatus = readChatInfo => {
	chats.value.forEach(chat => {
		if (chat.id === readChatInfo.chatSeq) {
			chat.readStatus = true;
		}
	});
};

const isRead = chatId => {
	return chats.value.find(chat => chat.id === chatId).readStatus;
};
// 스크롤 이벤트 리스너를 추가하는 함수
const setupScrollListener = () => {
	window.addEventListener('scroll', handleScroll);
};

// 스크롤 이벤트 핸들러
const handleScroll = () => {
	if (window.scrollY === 0 && !isLoading.value) {
		// 페이지 상단 근처에서만 채팅을 불러오도록 함
		fetchChats();
		scrollToLower();
	}
};

// 화면 마운트
onMounted(async () => {
	connectWebSocket();
	await fetchChats();
	setupScrollListener();
	nextTick(() => {
		markMessagesAsRead();
		scrollToBottom();
	});
});

// 컴포넌트 언마운트 시 웹소켓 연결 해제
onUnmounted(() => {
	if (stompClient && stompClient.connected) {
		stompClient.disconnect();
	}
	window.removeEventListener('scroll', handleScroll);
});

// 사용자가 채팅 발신자인지 확인
const amISender = senderSeq => {
	return senderSeq === userInfo.userSeq;
};

// 날짜 가져오기
const getDateTime = dateTime => {
	const result = formDate(dateTime);
	lastDate = result;
	return result;
};

// 날짜 리포맷팅
const formDate = dateTime => {
	const date = new Date(dateTime);
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const day = weekdays[date.getDay()];

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const dayOfMonth = String(date.getDate()).padStart(2, '0');
	return `${year}/${month}/${dayOfMonth} (${day})`;
};

// 시간 리포맷팅
const formTime = dateTime => {
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
const markMessagesAsRead = id => {
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
		chats.value.forEach(chat => {
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

// const scrollToLower = () => {
// 	window.scrollTo(0, window.innerHeight / 5);
// };
</script>
