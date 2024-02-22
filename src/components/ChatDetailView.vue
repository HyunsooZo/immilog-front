<template>
	<div class="modal modal--full chat--dialog">
		<div class="modal-content">
			<div class="modal-header">
				<div class="item__fnc">
					<button type="button" class="button-icon button--back" role="link" @click="closeModal">
						<i class="blind">이전화면</i>
					</button>
				</div>
				<div class="modal-title">
					<p class="list__item user">
						<strong>userNickname{{ post.userNickname }}</strong>
					</p>
				</div>
				<button class="button-icon button--menu" role="link" @click="onSideMenu">
					<i class="blind">메뉴</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="chat-wrap">
					<div class="chat__content">
						<!-- message -->
						<div class="chat__msg">
							<p class="text">채팅 요청을 보냈습니다.</p>
							<p class="text"><em class="user__name">userNickname{{ post.userNickname }}</em>님의 참여를 기다리는 중입니다. </p>
						</div>
						<!-- chat list -->
						<ul class="chat__list">
							<li class="item__notice">
								<span class="text">2. 18. <em>(일)</em></span>
							</li>
							<li class="item" aria-label="받은 메시지" data-content-type="text">
								<!-- 사용자 정보 -->
								<div class="info__wrap">
									<button type="button" class="item__pic" :class="{ 'pic--default': !post.userProfileUrl }">
										<img v-if="post.userProfileUrl" :src="post.userProfileUrl" alt="" />
									</button><!-- // 사용자 프로필 보기 -->
								</div>
								<div class="chat__message">
									<div class="item__message">
										<p class="text">
											받은 메시지
										</p>
									</div>
									<div class="item__fnc">
										<p class="list__item past">
											<i class="blind">받은시간</i>
											<span class="item__count">{{ timeCalculation(post.createdAt) }}</span>
										</p>
									</div>
								</div>
							</li>
							<li class="item _my" aria-label="보낸 메시지" data-content-type="text">
								<div class="chat__message">
									<div class="item__message">
										<p class="text">
											보낸 메시지 보낸 메시지 보낸 메시지 보낸 메시지 보낸 메시지 보낸 메시지
										</p>
									</div>
									<div class="item__fnc">
										<span class="list__item _read">읽지않음/읽음/전송실패(재전송)</span>
										<p class="list__item past">
											<i class="blind">보낸시간</i>
											<span class="item__count">{{ timeCalculation(post.createdAt) }}</span>
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
									<input type="file" id="file-upload" multiple="multiple"
										accept="image/jpeg, image/png, image/gif, image/jpg, image/tiff" @change="previewImage" />
									<label for="file-upload" class="button-icon__s" role="button">
										<svg viewBox="0 0 16 16">
											<path
												d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
											<path
												d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
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
								<button type="button" class="button-icon__s button--send"><!-- //text__area .active -->
									<svg viewBox="0 0 16 16">
										<path
											d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
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
import { ref } from 'vue';
import { modalCloseClass } from '@/services/utils';
import SideMenu from '@/components/SideMenu.vue';

//모달 닫는 에밋 (false 넘김)
const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
	modalCloseClass();
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

const post = ref({
	userNickName: '',
	userProfileUrl: '',
	createdAt: '',
});

const timeCalculation = localTime => {
	// LocalDateTime 문자열을 JavaScript Date 객체로 변환
	const postDate = new Date(localTime);
	const now = new Date();
	const diff = now.getTime() - postDate.getTime();

	// 시간 차이를 분 단위로 변환
	const diffMinutes = Math.floor(diff / (1000 * 60));

	if (diffMinutes < 10) {
		return '방금 전';
	} else if (diffMinutes < 60) {
		return `${Math.ceil(diffMinutes / 10) * 10}분 전`;
	}

	// 시간 차이를 시간 단위로 변환
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}시간 전`;
	}

	// 하루 이상 차이 나는 경우 날짜 포맷으로 반환
	return postDate.toLocaleString('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};
</script>
