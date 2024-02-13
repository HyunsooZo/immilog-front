<template>
	<!-- replydialog -->
	<div
		class="modal reply--dialog"
		tabindex="-1"
		role="dialog"
		@click.self="closeDialog"
	>
		<div class="modal-content">
			<div class="modal-header">
				<!-- 등록 -->
				<div class="item__fnc right">
					<button
						type="button"
						class="button-icon__s button--post_upload"
						@click="commentApi"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-check2-square"
							viewBox="0 0 16 16"
						>
							<path
								d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"
							/>
							<path
								d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"
							/>
						</svg>
						<span>등록</span>
					</button>
				</div>
				<button
					type="button"
					class="button-icon button--close"
					role="link"
					@click="closeDialog"
				>
					<span class="blind">닫기</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="post-wrap">
					<div class="post__wrap">
						<textarea
							v-model="textareaRef"
							class="text__area"
							name="content"
							autocomplete="off"
							placeholder="댓글을 입력해주세요. 일정 수 이상의 신고를 받는 경우 글이 자동으로 숨김처리 됩니다."
							data-autosuggest_is-input="true"
							ref="adjustTextare"
							@input="adjustTextareaHeight"
							rows="2"
						></textarea>

						<!-- <textarea v-model="content" class="text__area" name="content" autocomplete="off"
							placeholder="댓글을 입력해주세요. 다른 사용자로부터 일정 수 이상의 신고를 받는 경우 글이 자동으로 숨김처리 될 수 있습니다."
							data-autosuggest_is-input="true" ref="textareaRef" @input="adjustTextareaHeight" rows="2"></textarea> -->
					</div>
					<!-- <div class="util__wrap">
						<div class="item__fnc">
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
										<span class="blind">사진 선택</span>
									</label>
								</div>
							</div>
						</div>
					</div> -->
				</div>
			</div>
		</div>
	</div>
	<CustomAlert
		v-if="alertValue"
		:alertValue="alertValue"
		:alertText="alertText"
		@update:alertValue="closeAlert"
	/>
</template>

<script setup>
import { ref } from 'vue';
import useAxios from '@/composables/useAxios';
import CustomAlert from './modal/CustomAlert.vue';

const { sendRequest } = useAxios();

const alertValue = ref(false);
const alertText = ref('');

const emit = defineEmits(['close']);

const props = defineProps({
	postSeq: {
		type: Number,
		required: false,
	},
	commentSeq: {
		type: Number,
		required: false,
	},
	type: {
		type: String,
		required: true,
	},
});

const closeDialog = () => {
	emit('close');
};

const openAlert = content => {
	alertValue.value = true;
	alertText.value = content;
};

const closeAlert = () => {
	alertValue.value = false;
};

// textarea
const textareaRef = ref(null);
const adjustTextareaHeight = () => {
	const textarea = textareaRef.value;
	textarea.style.height = 'auto';
	textarea.style.height = `${textarea.scrollHeight}px`;
};

const commentApi = async () => {
	// 댓글 등록 api
	closeDialog();
	try {
		await sendRequest(
			'post',
			`/comments/posts/${props.postSeq}`,
			{
				headers: {
					contentType: 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			},
			{
				content: textareaRef.value,
			},
		);
	} catch (error) {
		openAlert('서버와의 통신에 실패했습니다.');
		console.log(error);
	}
};
</script>
