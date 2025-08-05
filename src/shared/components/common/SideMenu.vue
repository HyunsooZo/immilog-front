<template>
	<div class="sidemenu-wrap" @click.self="closeModal">
		<div class="sidemenu__inner">
			<div class="sidemenu-header">
				<div class="item__fnc">
					<button class="button-icon button--close" @click="closeModal">
						<i class="blind">취소</i>
					</button>
				</div>
			</div>
			<div class="sidemenu-body">
				<div class="title">채팅방 메뉴</div>
				<div class="list-wrap list--link item_preview">
					<ul>
						<li class="item">
							<button
								type="button"
								class="button button-text"
								@click="onImageBoard"
							>
								<span>사진</span>
							</button>
							<div class="item__list">
								<!-- // 미리보기 4개까지 -->
								<button type="button" class="thumb" @click="onImagePreview">
									<img src="@/assets/images/email-icon-logo.png" alt="" />
								</button>
								<button type="button" class="thumb" @click="onImagePreview">
									<img src="@/assets/images/icon-google-480.png" alt="" />
								</button>
							</div>
						</li>
						<li class="item">
							<button
								type="button"
								class="button button-text"
								@click="onLinkBoard"
							>
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
								<div class="item__image image--default">
									<img src="" alt="" />
								</div>
								<div class="item__fnc">
									<div class="list__item">
										<em>countries</em>
										<em>region</em>
									</div>
									<div class="list__item user">
										<strong>userNickname 본인</strong>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<button type="button" class="info__wrap">
								<div class="item__image">
									<img src="" alt="" />
								</div>
								<div class="item__fnc">
									<div class="list__item">
										<em>countries</em>
										<em>region</em>
									</div>
									<div class="list__item user">
										<strong>userNickname</strong>
									</div>
								</div>
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div class="sidemenu-footer">
				<div class="item__fnc">
					<button class="button-icon__s button--signout">
						<svg viewBox="0 0 16 16">
							<path :d="quitIcon.first"></path>
							<path :d="quitIcon.second"></path>
						</svg>
						<i class="blind">대화 나가기</i>
					</button>
				</div>
				<div class="item__fnc">
					<button class="button-icon__s button--setting">
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
	<ImagePreview @close="offImagePreview" v-if="isImagePreview" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { quitIcon, settingIcon } from '@/shared/utils/icons';
('');

//모달 닫는 에밋
const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
};

const isImagePreview = ref(false);
const onImagePreview = () => {
	isImagePreview.value = true;
};
const offImagePreview = () => {
	isImagePreview.value = false;
};

const onImageBoard = () => {};

const onLinkBoard = () => {};
</script>
