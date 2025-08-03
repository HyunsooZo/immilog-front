<template>
	<div class="content">
		<TheTopBox :title="'채팅'" />
		<SearchBox @searchValue="callSearchApi" @refetchChatRooms="refetch" />

		<div class="list-wrap _chat">
			<div
				class="item"
				v-for="chatRoom in chatRooms"
				:key="chatRoom.chatRoomId"
			>
				<button
					type="button"
					class="list__item_button"
					@click="onChatDetail(chatRoom.chatRoomId)"
				>
					<div class="info__wrap">
						<div
							class="item__image"
							:class="{
								'image--default':
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
									+amISender(chatRoom.sender)
										? t('countries.' + chatRoom.recipient.country)
										: t('countries.' + chatRoom.sender.country)
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
								<span class="item__count"
									>{{ timeCalculation(chatRoom.lastChatTime).time
									}}{{ t(timeCalculation(chatRoom.lastChatTime).text) }}</span
								>
							</p>
						</div>
					</div>
				</button>
				<div class="item__fnc">
					<button
						type="button"
						class="list__item_button more"
						@click.stop="openMoreModal(chatRoom.chatRoomId)"
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
	<MoreModal
		v-if="onMoreModal"
		:chatRoomSeq="onMoreChatRoomId"
		@close="closeMoreModal"
		@closeWithDelete="closeMoreModalAndDeleteChatRoom"
	/>
</template>

<script setup lang="ts">
import type { IChatRoom, IUser } from '@/shared/types/common';
import type {
	IApiChatRoom,
	IApiChatRoomList,
} from '@/features/chat/types/index';
import { applicationJsonWithToken, webSocketURL } from '@/shared/utils/header';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/features/auth/stores/userInfo';
import { timeCalculation } from '@/shared/utils/date-time';
import { useI18n } from 'vue-i18n';
import { AxiosResponse } from 'axios';
import TheTopBox from '@/shared/components/common/TheTopBox.vue';
import SearchBox from '@/shared/components/common/SearchBox.vue';
import MoreModal from '@/shared/components/ui/MoreModal.vue';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import api from '@/core/api/index';

const { t } = useI18n();

const userInfo = useUserInfoStore();
const router = useRouter();
const socket = new SockJS(webSocketURL + '/ws');
const stompClient = Stomp.over(socket);

// 채팅 목록 및 상세보기 관련 상태
const chatRooms = ref<IChatRoom[]>([]);
const chatRoomsPage = ref(0);
const page = ref({});

// 채팅 상세보기 관련 메서드
const onChatDetail = (chatRoomId: number) => {
	router.push('/chat/' + chatRoomId);
};

// 채팅목록 불러오기
const fetchChatList = async () => {
	try {
		const response: AxiosResponse<IApiChatRoom> = await api.get(
			`/chat/rooms?page=${chatRoomsPage.value}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			response.data.data.content.forEach((chatRoom: IChatRoom) => {
				chatRooms.value.push(chatRoom);
			});
			page.value = response.data.data.pageable;
		}
	} catch (error) {
		console.error(error);
	}
};

// 사용자가 채팅 발신자인지 확인
const amISender = (sender: IUser) => {
	const userId = userInfo.userId;
	return sender.userId === userId;
};

const updateChatRoomList = (updateChatRoom: IChatRoom) => {
	const index = chatRooms.value.findIndex(
		room => room.chatRoomId === updateChatRoom.chatRoomId,
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
			`/topic/updateChatRoomList/${userInfo.userId}`,
			message => {
				updateChatRoomList(JSON.parse(message.body));
			},
		);
	});
};

// <-- 더보기 모달 관련
const onMoreModal = ref(false);
const onMoreChatRoomId = ref(-1);

const openMoreModal = (chatRoomId: number) => {
	onMoreChatRoomId.value = chatRoomId;
	onMoreModal.value = true;
};

const closeMoreModal = () => {
	onMoreModal.value = false;
};

const closeMoreModalAndDeleteChatRoom = (chatRoomId: number) => {
	onMoreModal.value = false;
	const index = chatRooms.value.findIndex(
		chatRoom => chatRoom.chatRoomId === chatRoomId,
	);
	// 인덱스가 유효하면 해당 요소를 리스트에서 제거
	if (index !== -1) {
		chatRooms.value.splice(index, 1);
	}
};
// -->

const callSearchApi = async (searchValue: any) => {
	try {
		const response: AxiosResponse<IApiChatRoomList> = await api.get(
			`/chat/rooms/search?keyword=${searchValue}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			chatRooms.value = [];
			response.data.data.forEach((chatRoom: IChatRoom) => {
				chatRooms.value.push(chatRoom);
			});
		}
	} catch (error) {
		console.error(error);
	}
};

const refetch = () => {
	chatRooms.value = [];
	chatRoomsPage.value = 0;
	fetchChatList();
};

// 컴포넌트 마운트 시 초기화 및 채팅목록 불러오기
onMounted(async () => {
	if (!localStorage.getItem('accessToken')) {
		router.push('/sign-in');
	}
	await fetchChatList();
	connectWebSocket();
});

// 컴포넌트 언마운트 시 웹소켓 연결 해제
onUnmounted(() => {
	if (stompClient && stompClient.connected) {
		stompClient.disconnect(() => {
			// WebSocket 연결 해제됨
		});
	}
});
</script>
