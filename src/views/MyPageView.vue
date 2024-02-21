<template>
	<div class="content">
		<!-- 개인정보 -->
		<div class="list-wrap personal">
			<div class="item">
				<div class="info__wrap">
					<button type="button" class="item__pic" :class="{ 'pic--default': !userInfo.userProfile }">
						<img v-if="userInfo.userProfile" :src="userInfo.userProfile" alt="" />
					</button>
					<button type="button" class="item__fnc" role="link" @click="onProfileEdit">
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
					<button type="button" class="button button-text" role="link" @click="onMyBoard">
						<svg viewBox="0 0 16 16">
							<path
								d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm-5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm.79-5.373c.112-.078.26-.17.444-.275L3.524 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282c.024-.203.065-.37.123-.498a1.38 1.38 0 0 1 .252-.37 1.94 1.94 0 0 1 .346-.298zm2.167 0c.113-.078.262-.17.445-.275L5.692 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282a1.75 1.75 0 0 1 .118-.492c.058-.13.144-.254.257-.375a1.94 1.94 0 0 1 .346-.3z" />
						</svg>
						<span>내 게시물</span>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button button-text" role="link" @click="onBookmark">
						<svg viewBox="0 0 16 16">
							<path fill-rule="evenodd"
								d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
							<path
								d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
						</svg>
						<span>북마크</span>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button button-text" role="link">
						<svg viewBox="0 0 16 16">
							<path
								d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
							<path
								d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
						</svg>
						<span>설정 > 비밀번호 변경, 차단사용자 목록 차단/해제</span>
					</button>
				</li>
			</ul>
			<ul>
				<li class="item">
					<button type="button" class="button button-text" role="link">
						<svg viewBox="0 0 16 16">
							<path
								d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z" />
							<path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
						</svg>
						<span>공지사항</span>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button button-text" role="link" @click="openEmailForm">
						<svg viewBox="0 0 16 16">
							<path
								d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
							<path
								d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
						</svg>
						<span>고객센터</span>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button" role="link" @click="signOut">
						<svg viewBox="0 0 16 16">
							<path
								d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
							<path
								d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
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
import BookMark from '@/components/BookMark.vue';
import MyBoard from '@/components/MyBoard.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const onProfileEdit = () => {
	router.push(`/profile-edit`);
};

const userInfo = useUserInfoStore();

const isBookmarkOn = ref(false);

const onBookmark = () => {
	isBookmarkOn.value = true;
};

const offBookMark = () => {
	isBookmarkOn.value = false;
};

const isMyBoardOn = ref(false);

const onMyBoard = () => {
	isMyBoardOn.value = true;
};

const offMyBoard = () => {
	isMyBoardOn.value = false;
};

const modalValue = ref(false);

const modalText = ref('로그아웃 하시겠습니까?');

// 고객센터 이메일
const openEmailForm = () => {
	const userEmail = userInfo.userEmail;
	const userNickname = userInfo.userNickname;
	const userCountry = userInfo.userCountry;
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

const signOut = () => {
	localStorage.removeItem('accessToken');
	userInfo.signOut();
	router.push('/sign-in');
};

onMounted(() => {
	if (
		userInfo.userNickname === '' ||
		userInfo.userNickname === undefined ||
		userInfo.userNickname === null
	) {
		router.push({ name: 'SignIn' });
	}
});
</script>
