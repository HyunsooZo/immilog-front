<template>
	<TheHeader />
	<div class="content">
		<TheTopBox
			:title="'프로필 수정'"
			:text="'프로필 수정 후 확인 버튼을 눌러주세요.'"
		/>
		<div class="container">
			<!-- profileimage -->
			<div class="input-wrap">
				<em class="input__title">프로필 사진</em>
				<!-- input__wrap -->
				<div class="input__wrap input__attachments">
					<div class="input__item">
						<div class="input__item_inner">
							<div class="input__file">
								<input
									type="file"
									id="file-upload"
									class="input__element"
									@change="previewImage"
								/>
								<label
									for="file-upload"
									class="button button--primary"
									role="button"
								>
									<svg viewBox="0 0 16 16">
										<path :d="profilePicSelectIcon.first" />
										<path
											fill-rule="evenodd"
											:d="profilePicSelectIcon.second"
										/>
									</svg>
									<span>프로필 사진 선택</span>
								</label>
							</div>
							<div class="item__display">
								<img v-if="imagePreview" :src="imagePreview" alt="Preview" />
								<button
									v-if="imagePreview"
									type="button"
									class="button--del"
									@click="removeImage"
								>
									<i class="blind">삭제</i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- nickname -->
			<div class="input-wrap">
				<em class="input__title">닉네임 변경</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="userNickName"
								type="text"
								class="input__element"
								placeholder="닉네임 입력(5~10자 한글, 영문, 숫자 조합)"
								value="현수쓰"
							/>
						</div>
					</div>
					<button
						type="button"
						class="button button--primary"
						@click="checkNickName"
					>
						중복확인
					</button>
				</div>
				<!-- 에러 메시지 -->
				<p
					v-if="nickNameCheckDone && !isNickNameValid"
					class="input__error"
					aria-live="assertive"
				>
					이미 사용중인 닉네임 입니다.
				</p>
				<p
					v-if="nickNameCheckDone && isNickNameValid"
					class="input__text"
					aria-live="assertive"
				>
					사용 가능한 닉네임입니다.
				</p>
			</div>
			<!-- country -->
			<div class="input-wrap">
				<em class="input__title">접속 국가 변경</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="country"
								type="text"
								class="input__element"
								placeholder="지역"
								value="대한민국"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="button-wrap">
				<button class="button button--disabled" role="link">저장</button
				><!-- //버튼 활성 .button--positive / 비활성 .button--disabled -->
			</div>
		</div>
	</div>
</template>

<script setup>
import TheHeader from '@/components/layouts/TheHeader.vue';
import TheTopBox from '@/components/TheTopBox.vue';
import { profilePicSelectIcon } from '@/utils/icons';
</script>
