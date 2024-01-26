<template>
	<TheHeader />
	<div class="content">
		<!-- 글 상세 -->
		<div class="list-wrap">
			<p class="list__title">
				<span>카테고리</span>
			</p>
			<div class="item">
				<div class="info__wrap">
					<div class="item__pic">
						<img src="" alt="" />
					</div>
					<div class="item-fnc">
						<div class="list__item">
							<button type="button" class="list__item_button ctg">
								<em>국가</em>
								<strong>카테고리</strong>
							</button>
						</div>
						<div class="list__item">
							<button type="button" class="list__item_button user">
								<em>작성자</em>
								<strong>닉네임</strong>
							</button>
						</div>
					</div>
				</div>
				<div class="text__wrap">
					<div class="list__item">
						<p class="title">글제목 글제목 글제목</p>
						<p class="text">본문내용</p>
					</div>
				</div>
				<!-- 해시태그 -->
				<div class="tag-wrap">
					<div class="tag__inner">
						<div class="tag__item">
							<button type="button" class="button button--hash">
								<em>해시태그</em>
							</button>
							<button type="button" class="button button--hash">
								<em>해시태그</em>
							</button>
						</div>
					</div>
				</div>
				<div class="util__wrap">
					<div class="item-fnc">
						<button type="button" class="list__item_button like active">
							<!-- //활성화 .active -->
							<i class="blind">좋아요</i>
							<span class="item__count">10</span>
						</button>
						<button type="button" class="list__item cmt">
							<i class="blind">댓글</i>
							<span class="item__count">10</span>
						</button>
						<p class="list__item past">
							<i class="blind">작성시간</i>
							<span class="item__count">10시간 전</span>
						</p>
					</div>
					<div class="item-fnc">
						<button type="button" class="list__item_button share">
							<i class="blind">공유하기</i>
						</button>
					</div>
				</div>
			</div>
			<!-- //.item -->
		</div>

		<!-- 댓글 기능버튼 -->
		<div class="flexbox-wrap border--bot">
			<div class="sort__list">
				<button type="button" class="button--select sort">최신순</button>
			</div>
			<div class="sort__list">
				<button type="button" class="button--icon last">
					마지막 댓글로 이동
				</button>
			</div>
		</div>
		<!-- 댓글 -->
		<div class="list-wrap reply">
			<div class="item">
				<div class="info__wrap">
					<div class="item-fnc">
						<div class="list__item">
							<button type="button" class="list__item_button user">
								<em>댓글작성자</em>
								<strong>닉네임</strong>
							</button>
						</div>
					</div>
				</div>
				<div class="text__wrap">
					<div class="list__item">
						<p class="text">댓글내용</p>
					</div>
				</div>
				<div class="util__wrap">
					<div class="item-fnc">
						<button type="button" class="list__item_button like active">
							<!-- //활성화 .active -->
							<i class="blind">좋아요</i>
							<span class="item__count">10</span>
						</button>
						<button type="button" class="list__item cmt">
							<i class="blind">댓글</i>
							<span class="item__count">10</span>
						</button>
						<p class="list__item past">
							<i class="blind">작성시간</i>
							<span class="item__count">10시간 전</span>
						</p>
					</div>
					<div class="item-fnc">
						<button type="button" class="list__item_button more">
							<i class="blind">더보기</i
							><!-- //차단하기, 대화하기.. -->
						</button>
					</div>
				</div>
			</div>
			<!-- //.item -->
			<!-- 대댓글 -->
			<div class="re--reply">
				<div class="item">
					<div class="info__wrap">
						<div class="item-fnc">
							<div class="list__item">
								<button type="button" class="list__item_button user user--author"><!-- //원글작성자 댓글 .user--author -->
									<em>원글작성자 대댓글</em>
									<strong>닉네임</strong>
								</button>
							</div>
						</div>
					</div>
					<div class="text__wrap">
						<div class="list__item">
							<p class="text">대댓글내용</p>
						</div>
					</div>
					<div class="util__wrap">
						<div class="item-fnc">
							<button type="button" class="list__item_button like active">
								<!-- //활성화 .active -->
								<i class="blind">좋아요</i>
								<span class="item__count">10</span>
							</button>
							<p class="list__item past">
								<i class="blind">작성시간</i>
								<span class="item__count">10시간 전</span>
							</p>
						</div>
						<div class="item-fnc">
							<button type="button" class="list__item_button more">
								<i class="blind">더보기</i
								><!-- //차단하기, 대화하기.. -->
							</button>
						</div>
					</div>
				</div>
				<!-- //.item -->
				<div class="item">
					<div class="info__wrap">
						<div class="item-fnc">
							<div class="list__item">
								<button type="button" class="list__item_button user">
									<em>대댓글작성자</em>
									<strong>닉네임</strong>
								</button>
							</div>
						</div>
					</div>
					<div class="text__wrap">
						<div class="list__item">
							<p class="text">대댓글내용</p>
						</div>
					</div>
					<div class="util__wrap">
						<div class="item-fnc">
							<button type="button" class="list__item_button like">
								<!-- //활성화 .active -->
								<i class="blind">좋아요</i>
								<span class="item__count">10</span>
							</button>
							<p class="list__item past">
								<i class="blind">작성시간</i>
								<span class="item__count">10시간 전</span>
							</p>
						</div>
						<div class="item-fnc">
							<button type="button" class="list__item_button more">
								<i class="blind">더보기</i
								><!-- //차단하기, 대화하기.. -->
							</button>
						</div>
					</div>
				</div>
				<!-- //.item -->
			</div>
		</div>
	</div>
</template>

<script setup>
import TheHeader from '@/components/layouts/TheHeader.vue';
</script>
