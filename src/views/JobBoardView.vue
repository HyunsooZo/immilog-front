<template>
	<div class="content">
		<div class="modal modal--full search--dialog">
			<div class="modal-content">
				<div class="modal-header">
					<p class="modal-title">글쓰기</p>
					<button type="button" class="button button--primary">
						<span>등록</span>
					</button>
					<button class="button-icon button--close" role="link">
						<span class="blind">취소</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="write-wrap">
						<!-- selectbox -->
						<div class="flexbox-wrap border--bot">
							<div class="category__list">
								<button type="button" class="button--select">지역</button>
							</div>
						</div>
						<!-- write -->
						<div class="write__wrap">
							<!-- title -->
							<div class="write__title">
								<div class="input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" class="input__element" placeholder="제목을 입력해주세요." autocomplete="off" />
										</div>
									</div>
								</div>
							</div>
							<!-- contents -->
							<div class="write__content">
								<p class="writer">
									<em>지역</em><strong class="user">작성자닉네임</strong>
								</p>
								<div class="editable">
									<textarea class="text__area" name="content" autocomplete="off"
										placeholder="다른 사용자로부터 일정 수 이상의 신고를 받는 경우 글이 자동으로 숨김처리 될 수 있습니다."
										data-autosuggest_is-input="true"></textarea>
									<!-- file preview -->
									<div class="attach-file-view">
										<div class="file">
											<div class="file-display">
												<img src="@/assets/images/icon-google-480.png" alt="preview" style="width: 100px;">
												<button type="button" class="button--del"><span class="blind">삭제</span></button>
											</div>
											<div class="input__wrap underline-type">
												<div class="input__item">
													<div class="input__item_inner">
														<input type="text" class="input__element" placeholder="이미지에 대한 설명을 입력해주세요."
															autocomplete="off">
													</div>
												</div>
											</div>
										</div><!-- //loop -->
										<div class="file">
											<div class="file-display">
												<img src="@/assets/images/icon-google-480.png" alt="preview" style="width: 200px;">
												<button type="button" class="button--del"><span class="blind">삭제</span></button>
											</div>
											<div class="input__wrap underline-type">
												<div class="input__item">
													<div class="input__item_inner">
														<input type="text" class="input__element" placeholder="이미지에 대한 설명을 입력해주세요."
															autocomplete="off">
													</div>
												</div>
											</div>
										</div><!-- //loop -->
									</div>
								</div>
							</div>
						</div>
						<!--  -->
						<div class="util__wrap">
							<div class="item-fnc">
								<div class="input__wrap attach-file-wrap">
									<div class="input__item">
										<div class="input__item_inner">
											<div class="input__file">
												<input type="file" id="file-upload" multiple="multiple"
													accept="image/jpeg, image/png, image/gif, image/jpg, image/tiff" />
												<label for="file-upload" class="button" role="button">
													<svg width="20" height="20" viewBox="0 0 16 16">
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
								</div>
							</div>
							<div class="item-fnc">
								<button type="button" class="button">
									<svg width="20" height="20" viewBox="0 0 16 16">
										<path
											d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
									</svg>
									<i class="blind">해시태그 추가</i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup></script>
