<template>
	<div class="content">
		<TheTopBox :title="'채팅'" />

		<!-- 상단 고정 영역 -->
		<div class="sticky-wrap">
			<!-- 탭 메뉴 (HomePage 스타일 참고) -->
			<div class="menu-wrap">
				<ul class="menu__inner">
					<li :class="{ active: activeTab === 'my' }" class="menu__list">
						<button
							type="button"
							@click="switchTab('my')"
							class="button"
							:aria-selected="activeTab === 'my' ? 'true' : 'false'"
						>
							내 채팅방
						</button>
					</li>
					<li :class="{ active: activeTab === 'country' }" class="menu__list">
						<button
							type="button"
							@click="switchTab('country')"
							class="button"
							:aria-selected="activeTab === 'country' ? 'true' : 'false'"
						>
							국가별 채팅방
						</button>
					</li>
				</ul>
				<span
					class="menu__bar"
					:style="{ left: activeTab === 'my' ? '0%' : '50%', width: '50%' }"
				></span>
			</div>
		</div>

		<div class="list-top-wrap" v-if="activeTab === 'country'">
			<!-- 국가 선택 드롭다운 (국가별 채팅방일 때만 표시) -->
			<div class="fnc-wrap">
				<div class="category__list">
					<button
						type="button"
						class="button--select"
						@click="openCountrySelectForList"
					>
						<span class="country-with-flag" v-if="selectedCountryForList.name">
							<span
								v-if="
									getFlagCode(selectedCountryForList.code) &&
									getFlagCode(selectedCountryForList.code) !== 'world' &&
									getFlagCode(selectedCountryForList.code) !== 'etc'
								"
								:class="`fi fi-${getFlagCode(selectedCountryForList.code)}`"
								class="flag-icon"
							></span>
							<span
								v-else-if="getFlagCode(selectedCountryForList.code) === 'etc'"
								class="custom-icon flag-icon"
								>🏳️</span
							>
							{{ t(selectedCountryForList.name) }}
						</span>
						<span v-else>국가를 선택하세요</span>
					</button>
				</div>
			</div>
		</div>

		<!-- 채팅방 목록 -->
		<div class="list-wrap _chat">

			<!-- 채팅방이 없을 때 -->
			<div
				class="no-content"
				v-if="!loading && (!chatRooms || chatRooms.length === 0)"
			>
				<p v-if="activeTab === 'my'">참여중인 채팅방이 없습니다.</p>
				<p v-else-if="activeTab === 'country' && !selectedCountryId">
					국가를 선택해주세요.
				</p>
				<p v-else>해당 국가의 채팅방이 없습니다.</p>
			</div>

			<!-- 채팅방 목록 -->
			<div class="item" v-for="chatRoom in chatRooms || []" :key="chatRoom.id">
				<button
					type="button"
					class="list__item_button"
					@click="onChatDetail(chatRoom.id)"
				>
					<div class="info__wrap">
						<div class="item__image">
							<!-- 개인 채팅방인 경우 상대방 프로필 이미지 -->
							<div v-if="isPrivateChat(chatRoom)" class="private-chat-profile">
								<img 
									v-if="getChatRoomProfileUrl(chatRoom)"
									:src="getChatRoomProfileUrl(chatRoom)"
									:alt="getChatRoomDisplayName(chatRoom)"
									class="profile-image"
								/>
								<div v-else class="chat-room-icon">
									{{ getChatRoomDisplayName(chatRoom).charAt(0).toUpperCase() }}
								</div>
							</div>
							<!-- 국가별 채팅방인 경우 국기 표시 -->
							<div v-else-if="chatRoom.countryId && chatRoom.countryId !== 'ALL'" class="country-flag-icon">
								<span
									v-if="
										getFlagCode(chatRoom.countryId) &&
										getFlagCode(chatRoom.countryId) !== 'world' &&
										getFlagCode(chatRoom.countryId) !== 'etc'
									"
									:class="`fi fi-${getFlagCode(chatRoom.countryId)}`"
									class="flag-icon-large"
								></span>
								<span
									v-else-if="getFlagCode(chatRoom.countryId) === 'etc'"
									class="custom-flag-icon"
									>🏳️</span
								>
								<div v-else class="fallback-icon">
									{{ getChatRoomDisplayName(chatRoom).charAt(0).toUpperCase() }}
								</div>
							</div>
							<!-- 일반 채팅방 아이콘 (개인 채팅도 아니고 특정 국가도 아닌 경우) -->
							<div v-else class="chat-room-icon">
								{{ getChatRoomDisplayName(chatRoom).charAt(0).toUpperCase() }}
							</div>
						</div>
						<div class="item__fnc">
							<div class="list__item user">
								<strong>{{ getChatRoomDisplayName(chatRoom) }}</strong>
								<em>참여자 {{ chatRoom.participantCount }}명</em>
							</div>
						</div>
					</div>
					<div class="text__wrap">
						<div class="list__item">
							<div class="text__item">
								<p
									class="text"
									style="color: #999"
									v-if="!chatRoom.latestMessage"
								>
									채팅방에 참여해보세요!
								</p>
								<p class="text" v-else>
									<span class="latest-sender"
										>{{ chatRoom.latestMessage.senderNickname }}:</span
									>
									{{ chatRoom.latestMessage.content }}
								</p>
							</div>
						</div>
					</div>
					<div class="util__wrap">
						<div class="item__fnc">
							<p class="list__item past">
								<i class="blind">{{
									chatRoom.latestMessage ? '최근 메시지 시간' : '생성시간'
								}}</i>
								<span class="item__count">{{
									chatRoom.latestMessage
										? formatDate(chatRoom.latestMessage.sentAt)
										: formatDate(chatRoom.createdAt)
								}}</span>
							</p>
							<!-- 안읽은 메시지 수 표시 -->
							<div
								v-if="chatUnreadStore.getUnreadCount(chatRoom.id) > 0"
								class="unread-badge"
							>
								{{ chatUnreadStore.getUnreadCount(chatRoom.id) }}
							</div>
						</div>
					</div>
				</button>
				<div class="item__fnc">
					<button
						type="button"
						class="list__item_button more"
						@click.stop="openMoreModal(chatRoom.id)"
					>
						<i class="blind">더보기</i>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 채팅방 만들기 플로팅 버튼 (국가별 채팅방 탭에서만 표시) -->
	<button
		v-if="activeTab === 'country'"
		type="button"
		class="floating-add-button"
		@click="showCreateRoomModal = true"
	>
		<svg viewBox="0 0 16 16" width="24" height="24">
			<path
				d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
				fill="white"
			/>
		</svg>
	</button>

	<!-- 채팅방 생성 모달 -->
	<div v-if="showCreateRoomModal" class="modal modal--full post--dialog">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">채팅방 만들기</p>
				<button
					type="button"
					class="button-icon__s button--post_upload"
					@click="createChatRoom"
					:disabled="!newRoomName || !selectedCountryForChat.code"
				>
					<svg viewBox="0 0 16 16">
						<path
							d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
						/>
					</svg>
					<span>생성</span>
				</button>
				<button class="button-icon button--close" @click="closeCreateRoomModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="post-wrap">
					<!-- 국가 선택 -->
					<div class="fnc-wrap">
						<div class="category__list">
							<button
								type="button"
								class="button--select"
								@click="openCountrySelectForChat"
							>
								<span
									class="country-with-flag"
									v-if="selectedCountryForChat.name"
								>
									<span
										v-if="
											getFlagCode(selectedCountryForChat.code) &&
											getFlagCode(selectedCountryForChat.code) !== 'world' &&
											getFlagCode(selectedCountryForChat.code) !== 'etc'
										"
										:class="`fi fi-${getFlagCode(selectedCountryForChat.code)}`"
										class="flag-icon"
									></span>
									<span
										v-else-if="
											getFlagCode(selectedCountryForChat.code) === 'etc'
										"
										class="custom-icon flag-icon"
										>🏳️</span
									>
									{{ t(selectedCountryForChat.name) }}
								</span>
								<span v-else>국가를 선택하세요</span>
							</button>
						</div>
					</div>

					<!-- 채팅방 이름 입력 -->
					<div class="post__wrap">
						<div class="post__title">
							<div class="input__wrap underline-type">
								<div class="input__item">
									<div class="input__item_inner">
										<input
											v-model="newRoomName"
											type="text"
											class="input__element"
											placeholder="채팅방 이름을 입력하세요"
											autocomplete="off"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<MoreModal
		v-if="onMoreModal"
		:chatRoomSeq="onMoreChatRoomId"
		@close="closeMoreModal"
		@closeWithDelete="closeMoreModalAndDeleteChatRoom"
	/>

	<SelectDialog
		v-if="showCountrySelectModal"
		title="국가선택"
		:list="countryStore.countrySelectItems"
		@close="closeCountrySelect"
		@select:value="selectCountryForChat"
	/>

	<SelectDialog
		v-if="showCountrySelectForListModal"
		title="국가선택"
		:list="countryStore.countrySelectItems"
		@close="closeCountrySelectForList"
		@select:value="selectCountryForList"
	/>

	<CustomAlert
		v-if="alertValue"
		:alertText="alertText"
		@update:alertValue="closeAlert"
	/>
</template>

<script setup lang="ts">
import { onMounted, onActivated, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import type { IChatRoom } from '@/features/chat/types/index';
import { ChatService } from '@/features/chat/services/chatService';
import TheTopBox from '@/shared/components/common/TheTopBox.vue';
import MoreModal from '@/shared/components/ui/MoreModal.vue';
import SelectDialog from '@/shared/components/ui/SelectDialog.vue';
import CustomAlert from '@/shared/components/ui/CustomAlert.vue';
import { useCountryStore } from '@/features/country/stores/country';
import { countryCodeToFlagCode } from '@/shared/utils/flagMapping';
import { useI18n } from 'vue-i18n';
import { useChatUnreadStore } from '@/features/chat/stores/chatUnread';

const userInfo = useUserInfoStore();
const router = useRouter();
const countryStore = useCountryStore();
const chatUnreadStore = useChatUnreadStore();
const { t } = useI18n();

// 상태 관리
const activeTab = ref<'my' | 'country'>('my');
const chatRooms = ref<IChatRoom[]>([]);
const selectedCountryId = ref('');
const loading = ref(false);

// 채팅방 생성 모달
const showCreateRoomModal = ref(false);
const newRoomName = ref('');
const selectedCountryForChat = ref<{ name: string; code: string }>({
	name: '',
	code: '',
});

// 국가 선택 모달 (채팅방 생성용)
const showCountrySelectModal = ref(false);

// 국가 선택 모달 (목록 필터용)
const showCountrySelectForListModal = ref(false);
const selectedCountryForList = ref<{ name: string; code: string }>({
	name: 'selectItems.allCountries',
	code: 'ALL',
});

// 알림 모달
const alertValue = ref(false);
const alertText = ref('');

// 더보기 모달
const onMoreModal = ref(false);
const onMoreChatRoomId = ref('');

// 개인 채팅방인지 확인 (백엔드에서 isPrivateChat 필드 제공)
const isPrivateChat = (chatRoom: IChatRoom) => {
	return chatRoom.isPrivateChat === true;
};

// 개인 채팅방에서 상대방 참가자 찾기
const getOtherParticipant = (chatRoom: IChatRoom) => {
	if (!isPrivateChat(chatRoom)) return null;
	return chatRoom.participants.find(p => p.userId !== userInfo.userId) || null;
};

// 채팅방 표시용 이름 가져오기
const getChatRoomDisplayName = (chatRoom: IChatRoom) => {
	if (isPrivateChat(chatRoom)) {
		const otherParticipant = getOtherParticipant(chatRoom);
		return otherParticipant?.nickname || otherParticipant?.userId || '개인 채팅';
	}
	return chatRoom.name || '채팅방';
};

// 채팅방 표시용 프로필 이미지 URL 가져오기
const getChatRoomProfileUrl = (chatRoom: IChatRoom) => {
	if (isPrivateChat(chatRoom)) {
		const otherParticipant = getOtherParticipant(chatRoom);
		return otherParticipant?.profileImage || '';
	}
	return '';
};

// 채팅방 목록 정렬 (최근 메시지 순)
const sortChatRoomsByLatestMessage = (rooms: IChatRoom[]) => {
	return rooms.sort((a, b) => {
		// 최근 메시지가 있는 채팅방을 위로
		if (a.latestMessage && b.latestMessage) {
			return new Date(b.latestMessage.sentAt).getTime() - new Date(a.latestMessage.sentAt).getTime();
		}
		
		// 한쪽만 최근 메시지가 있으면 있는 쪽을 위로
		if (a.latestMessage && !b.latestMessage) return -1;
		if (!a.latestMessage && b.latestMessage) return 1;
		
		// 둘 다 최근 메시지가 없으면 생성일 순으로
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});
};

// 국가 목록은 countryStore에서 가져옴

// 탭 전환
const switchTab = (tab: 'my' | 'country') => {
	activeTab.value = tab;
	chatRooms.value = [];

	if (tab === 'my') {
		loadMyChatRooms();
	} else {
		// 국가별 채팅방 탭으로 전환 시 바로 전체국가 채팅방 조회
		selectedCountryId.value = 'ALL';
		selectedCountryForList.value = {
			name: 'selectItems.allCountries',
			code: 'ALL',
		};
		loadCountryChatRooms();
	}
};

// 기존 selectCountry 함수는 제거됨 (selectCountryForList로 대체)

// 내 채팅방 목록 로드
const loadMyChatRooms = async () => {
	if (loading.value || !userInfo.userId || !userInfo.accessToken) {
		console.log('loadMyChatRooms blocked:', {
			loading: loading.value,
			userId: userInfo.userId,
			hasToken: !!userInfo.accessToken,
		});
		return;
	}

	try {
		loading.value = true;
		console.log('Loading user chat rooms for userId:', userInfo.userId);

		const loadedRooms = await ChatService.getUserChatRooms(
			userInfo.userId,
			userInfo.accessToken,
		);

		// 최근 메시지 순으로 정렬 (가장 최근 메시지가 맨 위)
		chatRooms.value = sortChatRoomsByLatestMessage(loadedRooms);

		console.log('Loaded chat rooms:', chatRooms.value);
		console.log('Total chat rooms count:', chatRooms.value.length);

		// 각 채팅방의 안읽은 메시지 수 로드
		await loadUnreadCounts();
	} catch (error) {
		console.error('Failed to load my chat rooms:', error);
	} finally {
		loading.value = false;
	}
};

// 국가별 채팅방 목록 로드
const loadCountryChatRooms = async () => {
	if (!selectedCountryId.value || loading.value || !userInfo.accessToken)
		return;

	try {
		loading.value = true;
		const loadedRooms = await ChatService.getChatRoomsByCountry(
			selectedCountryId.value,
			userInfo.accessToken,
		);

		// 최근 메시지 순으로 정렬
		chatRooms.value = sortChatRoomsByLatestMessage(loadedRooms);

		// 각 채팅방의 안읽은 메시지 수 로드
		await loadUnreadCounts();
	} catch (error) {
		console.error('Failed to load country chat rooms:', error);
	} finally {
		loading.value = false;
	}
};

// 안읽은 메시지 수 로드
const loadUnreadCounts = async () => {
	if (!userInfo.userId || !userInfo.accessToken) return;

	try {
		// 전체 안읽은 수 API가 404 에러를 내므로 개별적으로 로드
		const unreadCountPromises = chatRooms.value.map(async room => {
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

		// Store에 모든 안읽은 수 업데이트
		const unreadCountsMap: Record<string, number> = {};
		unreadResults.forEach(result => {
			unreadCountsMap[result.roomId] = result.unreadCount;
		});

		chatUnreadStore.setAllUnreadCounts(unreadCountsMap);
		console.log('Updated unread counts in store:', unreadCountsMap);
	} catch (error) {
		console.error('Failed to load unread counts:', error);
	}
};

// 채팅방 상세보기
const onChatDetail = (chatRoomId: string) => {
	router.push('/chat/' + chatRoomId);
};

// 채팅방 생성
const createChatRoom = async () => {
	if (
		!newRoomName.value ||
		!selectedCountryForChat.value.code ||
		!userInfo.userId ||
		!userInfo.accessToken
	) {
		showAlert('모든 필드를 입력해주세요.');
		return;
	}

	try {
		loading.value = true;
		console.log('Creating chat room with data:', {
			name: newRoomName.value,
			countryId: selectedCountryForChat.value.code,
			userId: userInfo.userId,
		});

		const newRoom = await ChatService.createChatRoom(
			newRoomName.value,
			selectedCountryForChat.value.code,
			userInfo.userId,
			userInfo.accessToken,
		);

		console.log('Created chat room response:', newRoom);

		// 응답이 올바른지 확인
		if (!newRoom || !newRoom.id) {
			console.error('Invalid room response:', newRoom);
			showAlert('채팅방 생성 응답이 올바르지 않습니다.');
			return;
		}

		// 생성한 채팅방에 명시적으로 참여
		console.log('Joining created chat room:', newRoom.id);
		const joinResult = await ChatService.joinChatRoom(
			newRoom.id,
			userInfo.userId,
			userInfo.accessToken,
		);
		console.log('Join result:', joinResult);

		// 생성된 채팅방으로 이동
		router.push('/chat/' + newRoom.id);
		closeCreateRoomModal();
	} catch (error) {
		console.error('Failed to create chat room:', error);
		showAlert('채팅방 생성에 실패했습니다.');
	} finally {
		loading.value = false;
	}
};

// 채팅방 생성 모달 닫기
const closeCreateRoomModal = () => {
	showCreateRoomModal.value = false;
	newRoomName.value = '';
	selectedCountryForChat.value = { name: '', code: '' };
};

// 더보기 모달
const openMoreModal = (chatRoomId: string) => {
	onMoreChatRoomId.value = chatRoomId;
	onMoreModal.value = true;
};

const closeMoreModal = () => {
	onMoreModal.value = false;
};

const closeMoreModalAndDeleteChatRoom = (chatRoomId: string) => {
	onMoreModal.value = false;
	const index = chatRooms.value.findIndex(
		chatRoom => chatRoom.id === chatRoomId,
	);
	if (index !== -1) {
		chatRooms.value.splice(index, 1);
	}
};

// 국가 선택 모달 열기 (채팅방 생성용)
const openCountrySelectForChat = () => {
	showCountrySelectModal.value = true;
};

// 국가 선택 모달 닫기 (채팅방 생성용)
const closeCountrySelect = () => {
	showCountrySelectModal.value = false;
};

// 국가 선택 처리 (채팅방 생성용)
const selectCountryForChat = (country: { name: string; code: string }) => {
	selectedCountryForChat.value = country;
	closeCountrySelect();
};

// 국가 선택 모달 열기 (목록 필터용)
const openCountrySelectForList = () => {
	showCountrySelectForListModal.value = true;
};

// 국가 선택 모달 닫기 (목록 필터용)
const closeCountrySelectForList = () => {
	showCountrySelectForListModal.value = false;
};

// 국가 선택 처리 (목록 필터용)
const selectCountryForList = (country: { name: string; code: string }) => {
	selectedCountryForList.value = country;
	selectedCountryId.value = country.code;
	closeCountrySelectForList();
	loadCountryChatRooms();
};

// 알림 모달
const showAlert = (message: string) => {
	alertText.value = message;
	alertValue.value = true;
};

const closeAlert = () => {
	alertValue.value = false;
};

// 국기 코드 가져오기
const getFlagCode = (countryCode: string): string => {
	return countryCodeToFlagCode(countryCode);
};

// 날짜 포맷팅
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return date.toLocaleTimeString('ko-KR', {
			hour: '2-digit',
			minute: '2-digit',
		});
	} else if (diffDays === 1) {
		return '어제';
	} else if (diffDays < 7) {
		return `${diffDays}일 전`;
	} else {
		return date.toLocaleDateString('ko-KR');
	}
};

// 채팅방 목록 새로고침 확인
const checkAndRefreshChatRooms = () => {
	const shouldRefresh = localStorage.getItem('refreshChatRooms');
	if (shouldRefresh === 'true') {
		localStorage.removeItem('refreshChatRooms');
		if (activeTab.value === 'my') {
			loadMyChatRooms();
		} else {
			loadCountryChatRooms();
		}
	}
};

// 컴포넌트 마운트
onMounted(async () => {
	if (!userInfo.accessToken) {
		router.push('/sign-in');
		return;
	}

	// 국가 목록 불러오기
	await countryStore.fetchActiveCountries();

	// 국가별 채팅방 탭의 디폴트를 전체국가로 설정
	selectedCountryForList.value = {
		name: 'selectItems.allCountries',
		code: 'ALL',
	};
	selectedCountryId.value = 'ALL';

	loadMyChatRooms();

	// 페이지 focus 이벤트 리스너 추가
	window.addEventListener('focus', checkAndRefreshChatRooms);
});

// 컴포넌트가 활성화될 때 (라우터 캐시에서 복원될 때)
onActivated(() => {
	checkAndRefreshChatRooms();
});

// 컴포넌트 언마운트
onUnmounted(() => {
	window.removeEventListener('focus', checkAndRefreshChatRooms);
});
</script>

<style scoped>
/* 채팅방 아이콘 스타일 */
.chat-room-icon {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background: #007bff;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	font-size: 1.1em;
}

/* 국가별 채팅방 국기 아이콘 스타일 */
.country-flag-icon {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background: #f0f0f0;
}

.flag-icon-large {
	width: 2.5em;
	height: 1.8em;
	border-radius: 4px;
}

.custom-flag-icon {
	font-size: 1.5em;
}

.fallback-icon {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background: #007bff;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	font-size: 0.9em;
}

/* 국가 선택 버튼 스타일 */
.country-with-flag {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

/* 최신 메시지 스타일 */
.latest-sender {
	font-weight: 500;
	color: #007bff;
	margin-right: 0.3rem;
}

.text__item .text {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 200px;
}

.flag-icon {
	width: 1.2em;
	height: 0.9em;
	display: inline-block;
	border-radius: 2px;
}

.custom-icon {
	display: inline-block;
	width: 1.2em;
	height: 1.2em;
	text-align: center;
	font-size: 1em;
}

/* 기존 PostModal CSS를 사용하므로 추가 스타일 불필요 */

.no-content {
	text-align: center;
	padding: 2rem;
	color: #666;
}

/* 안읽은 메시지 뱃지 스타일 */
.unread-badge {
	background: #ff4757;
	color: white;
	border-radius: 10px;
	padding: 2px 6px;
	font-size: 0.75rem;
	font-weight: bold;
	min-width: 18px;
	height: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 4px;
}

/* 플로팅 버튼 스타일 */
.floating-add-button {
	position: fixed;
	bottom: 100px; /* 바텀 네비게이션 위에 위치 */
	right: 20px;
	width: 4rem; /* 홈화면과 동일한 크기 */
	height: 4rem; /* 홈화면과 동일한 크기 */
	border-radius: 50%;
	border: 1px solid #ccc;
	background: rgb(0 0 0 / 0.5); /* 홈화면과 동일한 색상 */
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 1000;
}

.floating-add-button svg {
	fill: rgb(255 255 255 / 1);
}

.floating-add-button:hover {
	opacity: 0.8;
}

.floating-add-button:active {
	transform: scale(0.95);
}

/* 개인 채팅방 프로필 이미지 스타일 */
.private-chat-profile {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.profile-image {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
}
</style>
