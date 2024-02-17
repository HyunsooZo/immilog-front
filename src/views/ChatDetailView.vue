<template>
	<div class="content">

		<div class="wrap_chat wrap_chatroom">
			<div class="wrap_chatroom_inner">
				<div class="talk_header">
					<div class="inner_wrap">
						<h1 class="blind">NAVER</h1>
						<h2 class="blind">cafe</h2>
						<div class="title_area">
							<div class="tit_room">
								<strong class="tit"><span class="blind">채팅방</span>닉네임</strong>
							</div>
						</div>
						<div class="talk_header_btn">
							<button type="button" aria-label="채팅방 메뉴보기" class="link_more">
							</button>
						</div>
						<div class="menu_chat menu_open" style="display: none;">
							채팅방 푸시 알림 라디오
							대화멤버
							-본인
							-상대방
							대화설정>프로필(삭제 차단) 채팅방 나가기
						</div>
					</div>
				</div>
				<div class="contents" style="">
					<div class="top_message">
						<div class="box">
							<p class="txt"> 채팅 요청을 보냈습니다. </p>
							<p class="txt"><em class="waiting_name"></em>님의 참여를 기다리는 중입니다. </p>
						</div>
					</div>
					<div class="cont_chat talk_notice_top_zero" style="bottom: 56px;">
						<ul class="list_talk"></ul>
					</div>
					<div class="talk_write">
						<div class="frame_talk_scroll">
							<div class="frame_msg">
								<p class="msg_stop"> 활동 정지로 인해 이용이 제한됩니다. </p>
								<div class="attach_button">
									<button type="button" class="btn_more">추가 기능 더보기</button>
									<div data-v-439b7363="" data-v-13da6721="" class="BasicLayer InputMoreLayer">
										<div data-v-439b7363="" class="layer_dimmed"></div>
										<div data-v-439b7363="" class="LayerPopup">
											<div data-v-439b7363="" class="layer_content">
												<div data-v-13da6721="" data-v-439b7363="" class="link">
													<label for="fileAttach" class="label_txt">사진</label>
													<input id="fileAttach" type="file" multiple="multiple" accept="image/*" class="input_file">
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="inner">
									<input type="text" class="blind">
									<label for="msgInputArea" class="blind">채팅입력창</label>
									<textarea id="msgInputArea" rows="1" placeholder="메시지를 입력하세요." autocomplete="off" class="msg_input"
										style="overflow: hidden; overflow-wrap: break-word; height: 20px;"></textarea>
								</div>
								<div class="frame_attach">
									<button type="button" role="button" class="btn_attach btn_sticker"></button>
									<button type="button" role="button" class="btn_attach btn_send"></button>
								</div>
							</div>
						</div>
					</div>
					<div class="dimmed_layer favorite_text_layer" style="display: none;">
						<div class="layer">
							<div class="inner_layer">
								<p class="layer_tit"> 자주 쓰는 문구 </p>
								<ul class="favorite_text_list">
									<li class="favorite_text_item">
										<a href="#" class="favorite_text_button favorite_text_setting">자주 쓰는 문구 설정</a>
									</li>
								</ul>
								<a href="#" class="link_close">닫기</a>
							</div>
						</div>
					</div>
				</div><!---->
			</div>
		</div>

	</div>
</template>

<script setup>
</script>
