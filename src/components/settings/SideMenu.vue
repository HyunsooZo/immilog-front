<template>
	<div class="sidemenu-wrap" @click.self="closeModal">
		<div class="sidemenu__inner">
			<div class="sidemenu-header">
				<div class="item__fnc">
					<button class="button-icon button--close" role="link" @click="closeModal">
						<i class="blind">취소</i>
					</button>
				</div>
			</div>
			<div class="sidemenu-body">
				<div class="title">채팅방 메뉴</div>
				<div class="list-wrap list--link item_preview">
					<ul>
						<li class="item">
							<button type="button" class="button button-text" role="link" @click="onPicBoard">
								<span>사진</span>
							</button>
							<div class="item__list">
								<!-- // 미리보기 4개까지 -->
								<button type="button" class="thumb">
									<img src="@/assets/images/email-icon-logo.png" alt="" />
								</button>
								<button type="button" class="thumb">
									<img src="@/assets/images/icon-google-480.png" alt="" />
								</button>
							</div>
						</li>
						<li class="item">
							<button type="button" class="button button-text" role="link" @click="onLinkBoard">
								<span>링크</span>
							</button>
						</li>
					</ul>
				</div>

				<div class="title">대화상대</div>
				<div class="list-wrap list--link item_profile">
					<ul>
						<li class="item">
							<div class="info__wrap">
								<div class="item__pic pic--default">
									<img src="" alt="" />
								</div>
								<div class="item__fnc">
									<div class="list__item">
										<em>countries</em>
										<em>region</em>
									</div>
									<div class="list__item user">
										<strong>userNickName 본인</strong>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<button type="button" class="info__wrap">
								<div class="item__pic">
									<img src="" alt="" />
								</div>
								<div class="item__fnc">
									<div class="list__item">
										<em>countries</em>
										<em>region</em>
									</div>
									<div class="list__item user">
										<strong>userNickName</strong>
									</div>
								</div>
							</button><!-- // 사용자 프로필 보기 -->
						</li>
					</ul>
				</div>
			</div>
			<div class="sidemenu-footer">
				<div class="item__fnc">
					<button class="button-icon__s button--signout" role="link">
						<svg viewBox="0 0 16 16">
							<path :d="quitIcon.first"></path>
							<path :d="quitIcon.second"></path>
						</svg>
						<i class="blind">대화 나가기</i>
					</button>
				</div>
				<div class="item__fnc">
					<button class="button-icon__s button--setting" role="link">
						<svg viewBox="0 0 16 16">
							<path :d="settingIcon.first" />
							<path :d="settingIcon.second" />
						</svg>
						<i class="blind">대화 설정</i>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { quitIcon, settingIcon } from '@/utils/icons.ts';

//모달 닫는 에밋
const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
};

const onPicBoard = () => {

}

const onLinkBoard = () => {

}
</script>
