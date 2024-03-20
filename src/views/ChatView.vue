<template>
	<div class="content">
		<TheTopBox :title="'채팅'" />
		<SearchBox />
		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
			<div class="fnc-wrap">
				<div class="search-wrap blind" :class="{ active: isSearchOpen }">
					<div class="input-wrap">
						<div class="input__inner">
							<button
								class="button button--search"
								role="link"
								@click="openSearchInput"
							>
								<i class="blind">채팅 검색</i>
							</button>
							<div class="input__inner-wrap">
								<div class="input__inner-item">
									<input
										v-model="searchInput"
										type="search"
										id="inputSrch"
										class="input__element input__element--search"
										placeholder="검색어를 입력 후 엔터를 눌러주세요"
										autocomplete="off"
										@keyup.enter="callSearchApi"
									/>
									<button
										v-if="searchInput !== ''"
										type="button"
										class="input__button-remove"
										title="텍스트삭제"
										@click="initializeSearchInput"
									></button>
								</div>
								<button
									class="button button--close"
									role="link"
									@click="closeSearchInput"
								>
									<i class="blind">취소</i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="list-wrap chat">
			<div class="item" v-for="chatRoom in chatRooms" :key="chatRoom.seq">
				<button
					type="button"
					class="list__item_button"
					@click="onChatDetail(chatRoom.seq)"
				>
					<div class="info__wrap">
						<div
							class="item__pic pic"
							:class="{
								'pic--default':
									(amISender(chatRoom.sender) &&
										chatRoom.recipient.profileImage === '') ||
									(amISender(chatRoom.recipient) &&
										chatRoom.sender.profileImage === ''),
							}"
						>
							<img
								:src="
									amISender(chatRoom.sender)
										? chatRoom.recipient.profileImage
										: chatRoom.sender.profileImage
								"
								alt=""
								v-if="
									(amISender(chatRoom.sender) &&
										chatRoom.recipient.profileImage !== '') ||
									(amISender(chatRoom.recipient) &&
										chatRoom.sender.profileImage !== '')
								"
							/>
						</div>
						<div class="item__fnc">
							<div class="list__item user">
								<em>{{
									amISender(chatRoom.sender)
										? chatRoom.recipient.country
										: chatRoom.sender.country
								}}</em>
								<strong>{{
									amISender(chatRoom.sender)
										? chatRoom.recipient.nickName
										: chatRoom.sender.nickName
								}}</strong>
							</div>
						</div>
					</div>
					<div class="text__wrap">
						<div class="list__item">
							<div class="text__item">
								<p class="text" v-if="chatRoom.lastChat !== ' '">
									{{ chatRoom.lastChat }}
								</p>
								<p class="text" style="color: #9999" v-else>
									"채팅 내역이 없습니다. 채팅을 시작해보세요!"
								</p>
							</div>
						</div>
					</div>
					<div class="util__wrap">
						<div class="item__fnc">
							<p class="list__item past">
								<i class="blind">작성시간</i>
								<span class="item__count">{{
									timeCalculation(chatRoom.lastChatTime)
								}}</span>
							</p>
						</div>
					</div>
				</button>
				<div class="item__fnc">
					<button
						type="button"
						class="list__item_button more"
						@click.stop="test"
					>
						<i class="blind">더보기</i
						><!-- //신고, 나가기 -->
					</button>
					<div
						class="item__badge"
						v-if="
							(amISender(chatRoom.sender) &&
								chatRoom.unreadCountForSender > 0) ||
							(!amISender(chatRoom.sender) &&
								chatRoom.unreadCountForRecipient > 0)
						"
					>
						<span class="text">
							{{
								amISender(chatRoom.sender)
									? chatRoom.unreadCountForSender
									: chatRoom.unreadCountForRecipient
							}}
						</span>
					</div>
				</div>
			</div>
			<!-- // .item -->
		</div>
	</div>
</template>

<script setup>
import TheTopBox from '@/components/search/TheTopBox.vue';
import SearchBox from '@/components/search/SearchBox.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import useAxios from '@/composables/useAxios';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/userInfo.js';
import { timeCalculation } from '@/utils/date-time.js';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const server = import.meta.env.VITE_APP_API_URL.replace('/api/v1', '');
const userInfo = useUserInfoStore();
const router = useRouter();
const { sendRequest } = useAxios(router);
const socket = new SockJS(server + '/ws');
const stompClient = Stomp.over(socket);

// 채팅 목록 및 상세보기 관련 상태
const isSearchOpen = ref(false);
const searchInput = ref('');
const chatRooms = ref([]);
const chatRoomsPage = ref(0);
const page = ref({});

// 채팅 검색 관련 메소드
const initializeSearchInput = () => {
	searchInput.value = '';
};

// 검색 모달 열기 및 닫기
const openSearchInput = () => {
	isSearchOpen.value = true;
};
const closeSearchInput = () => {
	isSearchOpen.value = false;
	searchInput.value = '';
};

// 채팅 상세보기 관련 메서드
const onChatDetail = seq => {
	router.push('/chat/' + seq);
};

// 채팅목록 불러오기
const fetchChatList = async () => {
	try {
		const { status, data } = await sendRequest(
			'get',
			`/chat/rooms?page=${chatRoomsPage.value}`,
			{
				headers: {
					contentType: 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			},
			null,
		);
		if (status === 200) {
			data.data.content.forEach(chatRoom => {
				chatRooms.value.push(chatRoom);
			});
			page.value = data.data.pageable;
		}
	} catch (error) {
		console.error(error);
	}
};

// 사용자가 채팅 발신자인지 확인
const amISender = sender => {
	const userSeq = userInfo.userSeq;
	return sender.seq === userSeq;
};

const updateChatRoomList = updateChatRoom => {
	const index = chatRooms.value.findIndex(
		room => room.id === updateChatRoom.id,
	);
	if (index !== -1) {
		chatRooms.value.splice(index, 1);
	}
	chatRooms.value.unshift(updateChatRoom);
};

// 웹소켓 연결 및 구독 설정
const connectWebSocket = () => {
	stompClient.connect({}, () => {
		// 채팅방 상태 업데이트 등록
		stompClient.subscribe(
			`/topic/updateChatRoomList/${userInfo.userSeq}`,
			message => {
				updateChatRoomList(JSON.parse(message.body));
			},
		);
	});
};

const test = () => {
	console.log('test');
};

// 컴포넌트 마운트 시 초기화 및 채팅목록 불러오기
onMounted(async () => {
	if (localStorage.getItem('accessToken') === null) {
		router.push('/sign-in');
	}
	await fetchChatList();
	connectWebSocket();
});

// 컴포넌트 언마운트 시 웹소켓 연결 해제
onUnmounted(() => {
	if (stompClient && stompClient.connected) {
		stompClient.disconnect();
	}
});
</script>
