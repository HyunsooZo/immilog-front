<template>
	<div class="content">
		<!-- 개인정보 -->
		<div class="list-wrap personal">
			<div class="item">
				<div class="info__wrap">
					<button
						type="button"
						class="item__pic"
						:class="{ 'pic--default': !userInfo.userProfile }"
					>
						<img
							v-if="userInfo.userProfile"
							:src="userInfo.userProfile"
							alt=""
						/>
					</button>
					<button
						type="button"
						class="item__fnc"
						role="link"
						@click="onProfileEdit"
					>
						<div class="list__item">
							<em>{{ userInfo.userCountry }}</em>
							<em>{{ userInfo.userCountry }}</em>
						</div>
						<div class="list__item user button-text">
							<strong>{{ userInfo.userNickname }}</strong>
						</div>
					</button>
				</div>
			</div>
		</div>
		<!--  -->
		<div class="list-wrap list--link">
			<ul>
				<li class="item">
					<button
						type="button"
						class="button button-text"
						role="link"
						@click="onMyBoard"
					>
						<svg viewBox="0 0 16 16">
							<path :d="myPostIcon" />
						</svg>
						<span>내 게시물</span>
					</button>
				</li>
				<li class="item">
					<button
						type="button"
						class="button button-text"
						role="link"
						@click="onBookmark"
					>
						<svg viewBox="0 0 16 16">
							<path fill-rule="evenodd" :d="bookmarkIcon.first" />
							<path :d="bookmarkIcon.second" />
						</svg>
						<span>북마크</span>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button button-text" role="link">
						<svg viewBox="0 0 16 16">
							<path :d="settingIcon.first" />
							<path :d="settingIcon.second" />
						</svg>
						<span>설정 > 비밀번호 변경, 차단사용자 목록 차단/해제</span>
					</button>
				</li>
			</ul>
			<ul>
				<li class="item">
					<button type="button" class="button button-text" role="link">
						<svg viewBox="0 0 16 16">
							<path :d="noticeIcon.first" />
							<path :d="noticeIcon.second" />
						</svg>
						<span>공지사항</span>
					</button>
				</li>
				<li class="item">
					<button
						type="button"
						class="button button-text"
						role="link"
						@click="openEmailForm"
					>
						<svg viewBox="0 0 16 16">
							<path :d="customerCenterIcon.first" />
							<path :d="customerCenterIcon.second" />
						</svg>
						<span>고객센터</span>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button" role="link" @click="signOut">
						<svg viewBox="0 0 16 16">
							<path :d="logoutIcon.first" />
							<path :d="logoutIcon.second" />
						</svg>
						<span>로그아웃</span>
					</button>
				</li>
			</ul>
		</div>
		<BookMark @update:bookmarkValue="offBookMark" v-if="isBookmarkOn" />
		<MyBoard @close="offMyBoard" v-if="isMyBoardOn" />
	</div>
	<teleport to="#modal" v-if="modalValue">
		<ConfirmModal :modalText="modalText" @modalValue="closeAlert" />
	</teleport>
</template>

<script setup>
import BookMark from '@/components/board/BookMark.vue';
import MyBoard from '@/components/board/MyBoard.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
	myPostIcon,
	bookmarkIcon,
	settingIcon,
	noticeIcon,
	customerCenterIcon,
	logoutIcon,
} from '@/utils/icons.js';

const router = useRouter();
const userInfo = useUserInfoStore();

// 프로필 수정 페이지로 이동
const onProfileEdit = () => router.push(`/profile-edit`);

// 북마크 표시 상태
const isBookmarkOn = ref(false);
const onBookmark = () => (isBookmarkOn.value = true);
const offBookMark = () => (isBookmarkOn.value = false);

// 내 게시판 표시 상태
const isMyBoardOn = ref(false);
const onMyBoard = () => (isMyBoardOn.value = true);
const offMyBoard = () => (isMyBoardOn.value = false);

// 모달 상태
const modalValue = ref(false);
const modalText = ref('로그아웃 하시겠습니까?');

// 고객센터 이메일 발송
const openEmailForm = () => {
	const { userEmail, userNickname, userCountry } = userInfo;
	const deviceInfo = navigator.userAgent;
	const appVersion = '앱 버전';
	const osVersion =
		navigator.userAgent.match(/(?:\w+\s)?(?:\w+\s)?(?:\w+\/)?([\d._]+)/)[1] ||
		'N/A';
	const email = 'komeet@gmail.com';
	const subject = '[komeet] 문의/요청/신고 합니다';
	const body = `\n\n--------------------\n이메일: ${userEmail}\n닉네임: ${userNickname}\n접속국가: ${userCountry}\n기기 정보: ${deviceInfo}\n앱 버전: ${appVersion}\nOS 버전: ${osVersion}`;
	const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
		subject,
	)}&body=${encodeURIComponent(body)}`;

	window.location.href = mailtoLink;
};

// 로그아웃 처리
const signOut = () => {
	localStorage.removeItem('accessToken');
	userInfo.signOut();
	router.push('/sign-in');
};

// 사용자 정보 확인 후 로그인 페이지로 리다이렉트
onMounted(() => {
	if (!userInfo.userNickname) {
		router.push({ name: 'SignIn' });
	}
});
</script>
