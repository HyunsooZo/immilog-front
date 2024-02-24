<template>
	<div class="content">
		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
			<div class="fnc-wrap _search">
				<div class="category__list">
					<button
						type="button"
						class="button--select"
						@click="openCategorySelect"
					>
						<span>selectCategoryValue.name</span>
					</button>
				</div>
				<div class="sort__list">
					<button
						type="button"
						class="button--select sort"
						@click="openSortingSelect"
					>
						<span>selectSortingValue.name</span>
					</button>
				</div>
				<div class="search-wrap" :class="{ active: isSearchOpen }">
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
										chatRoom.sender.profileImage === ' ') ||
									(amISender(chatRoom.recipient) &&
										chatRoom.recipient.profileImage === ' '),
							}"
						>
							<img
								:src="
									amISender(chatRoom.sender)
										? chatRoom.sender.profileImage
										: chatRoom.recipient.profileImage
								"
								alt=""
								v-if="
									(amISender(chatRoom.sender) &&
										chatRoom.sender.profileImage !== ' ') ||
									(amISender(chatRoom.recipient) &&
										chatRoom.recipient.profileImage !== ' ')
								"
							/>
						</div>
						<div class="item__fnc">
							<div class="list__item user">
								<em>{{
									amISender(chatRoom.sender)
										? chatRoom.sender.country
										: chatRoom.recipient.country
								}}</em>
								<strong>{{
									amISender(chatRoom.sender)
										? chatRoom.sender.nickName
										: chatRoom.recipient.nickName
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
					<button type="button" class="list__item_button more">
						<i class="blind">더보기</i
						><!-- //신고, 나가기 -->
					</button>
				</div>
			</div>
			<!-- // .item -->
		</div>
		<ChatDetailView
			:chatRoomSeq="roomSeq"
			@close="offChatDetail"
			v-if="isChatDetail"
		/>
	</div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { modalOpenClass, modalCloseClass } from '@/services/utils';
import ChatDetailView from '@/components/ChatDetailView.vue';
import useAxios from '@/composables/useAxios';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/userInfo.js';
import { timeCalculation } from '@/services/utils';

const userInfo = useUserInfoStore();
const router = useRouter();
const { sendRequest } = useAxios();
const isSearchOpen = ref(false);
const searchInput = ref('');
const chatRooms = ref([]);
const chatRoomsPage = ref(0);
const page = ref({});

const initializeSearchInput = () => {
	searchInput.value = '';
};

const openSearchInput = () => {
	isSearchOpen.value = true;
};
const closeSearchInput = () => {
	isSearchOpen.value = false;
	searchInput.value = '';
};

const isChatDetail = ref(false);
const roomSeq = ref(null);

const onChatDetail = seq => {
	roomSeq.value = seq;
	isChatDetail.value = true;
	modalOpenClass();
};
const offChatDetail = () => {
	isChatDetail.value = false;
	modalCloseClass();
};

const fetchChatList = async () => {
	try {
		const { status, data } = await sendRequest(
			'get',
			`/chat/rooms?page=${chatRoomsPage.value}`,
			{
				headers: {
					contentType: 'application/json',
					Authorization: `Bearer ${userInfo.accessToken}`,
				},
			},
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

const amISender = sender => {
	const userSeq = userInfo.userSeq;
	return sender.seq === userSeq;
};

onMounted(() => {
	if (localStorage.getItem('accessToken') === null) {
		router.push('/sign-in');
	}
	fetchChatList();
});
</script>
