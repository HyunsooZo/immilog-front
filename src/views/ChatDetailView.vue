<template>
	<div class="modal modal--full chat--dialog" v-if="chats.length > 0">
		<div class="modal-content">
			<div class="modal-header">
				<div class="item__fnc">
					<button
						type="button"
						class="button-icon button--back"
						role="link"
						@click="closeModal"
					>
						<i class="blind">이전화면</i>
					</button>
				</div>
				<div class="modal-title">
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
				<button
					class="button-icon button--menu"
					role="link"
					@click="onSideMenu"
				>
					<i class="blind">메뉴</i>
				</button>
			</div>
			<div class="modal-body">
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
						<ul class="chat__list" v-for="chat in chats" :key="chat.id">
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
											<span class="item__count">{{
												formDateTime(chat.createdAt)
											}}</span>
										</p>
									</div>
								</div>
							</li>
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
			</div>
		</div>
		<SideMenu @close="offSideMenu" v-if="isSideMenu" />
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import SideMenu from '@/components/SideMenu.vue';
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
const localhost = 'http://localhost:8080';
const prodServer = 'https://api.ko-meet-back.com';

const socket = new SockJS(prodServer + '/ws');
const stompClient = Stomp.over(socket);

const content = ref('');
const pageable = ref({});
const page = ref(0);
let lastDate = null;
const chatRoomSeq = ref(route.params.chatRoomId);

const closeModal = () => {
	router.back();
};

//side menu
const isSideMenu = ref(false);
const onSideMenu = () => {
	isSideMenu.value = true;
};
const offSideMenu = () => {
	isSideMenu.value = false;
};

// textarea
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

const chats = ref([]);

const fetchChats = async () => {
	try {
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
			data.data.pageable = pageable.value;
		}
	} catch (error) {
		console.error(error);
	} finally {
		nextTick(() => {
			scrollToBottom();
		});
	}
};

const fetchMore = async () => {
	page.value = pageable.value.pageNumber + 1;
	await fetchChats();
};

// 웹소켓 연결 및 구독 설정
const connectWebSocket = () => {
	stompClient.connect({}, () => {
		stompClient.subscribe(`/topic/room/${chatRoomSeq.value}`, message => {
			const newMessage = JSON.parse(message.body);
			chats.value.push(newMessage);
			nextTick(() => {
				scrollToBottom();
			});
		});
	});
};

// 스크롤 이벤트 리스너를 추가하는 함수
const addScrollListener = () => {
	const chatContainer = document.querySelector('.chat__content');
	if (chatContainer) {
		chatContainer.addEventListener('scroll', handleScroll);
	}
};

// 스크롤 이벤트 리스너를 제거하는 함수
const removeScrollListener = () => {
	const chatContainer = document.querySelector('.chat__content');
	if (chatContainer) {
		chatContainer.removeEventListener('scroll', handleScroll);
	}
};

// 스크롤 이벤트 핸들러
const handleScroll = event => {
	const chatContainer = event.target;
	console.log(chatContainer.scrollTop);
	if (chatContainer.scrollTop === 0) {
		console.log('fetchMore');
		fetchMore(); // 스크롤이 맨 위에 도달했을 때 fetchMore 호출
	}
};

onMounted(async () => {
	await fetchChats();
	connectWebSocket();
	markMessagesAsRead();
	addScrollListener();
});

// 컴포넌트 언마운트 시 웹소켓 연결 해제
onUnmounted(() => {
	if (stompClient && stompClient.connected) {
		stompClient.disconnect();
	}
	removeScrollListener();
});

const amISender = senderSeq => {
	return senderSeq === userInfo.userSeq;
};

const getDateTime = dateTime => {
	const result = formDate(dateTime);
	lastDate = result;
	return result;
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

const formDate = dateTime => {
	const date = new Date(dateTime);
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const day = weekdays[date.getDay()];

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const dayOfMonth = String(date.getDate()).padStart(2, '0');
	return `${year}/${month}/${dayOfMonth} (${day})`;
};

const formDateTime = dateTime => {
	const date = new Date(dateTime);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	// 같다면 시간 부분만 반환
	return `${hours}:${minutes}`;
};

// 채팅방에 들어갔을 때 '읽음' 상태를 서버에 보내는 함수
const markMessagesAsRead = () => {
	// 모든 메시지를 '읽음'으로 표시
	chats.value.forEach(chat => {
		if (!amISender(chat.sender.seq) && !chat.isRead) {
			// 읽음 상태를 서버에 보내기
			stompClient.send(
				'/app/chat/read',
				{},
				JSON.stringify({
					messageId: chat.id,
					userId: userInfo.userSeq,
				}),
			);

			// 프론트엔드에서 상태 업데이트
			chat.isRead = true;
		}
	});
};

// 스크롤을 맨 아래로 내리는 함수
const scrollToBottom = () => {
	const chatContainer = document.querySelector('.chat__content');
	if (chatContainer) {
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}
};
</script>
