<template>
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
							<em>지역</em>
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
				<button type="button" class="list__item_button text-link" @click="onBoardDetail(1)">
					<p class="title">
						글제목 글제목 글제목 글제목 글제목 글제목 글제목 글제목 글제목
					</p>
					<p class="text">
						내용미리보기 내용미리보기 내용미리보기 내용미리보기 내용미리보기
						내용미리보기 내용미리보기 내용미리보기 내용미리보기 내용미리보기 내용미리보기 내용미리보기
					</p>
				</button>
			</div>
			<div class="util__wrap">
				<div class="item-fnc">
					<p class="list__item read">
						<i class="blind">조회수</i>
						<span class="item__count">10</span>
					</p>
					<button type="button" class="list__item_button like active">
						<!-- //활성화 .active -->
						<i class="blind">좋아요</i>
						<span class="item__count">10</span>
					</button>
					<p class="list__item cmt">
						<i class="blind">댓글</i>
						<span class="item__count">10</span>
					</p>
				</div>
				<div class="item-fnc">
					<p class="list__item past">
						<i class="blind">작성시간</i>
						<span class="item__count">10시간 전</span>
					</p>
					<button type="button" class="list__item_button mark active">
						<!-- //활성화 .active -->
						<i class="blind">북마크</i>
					</button>
				</div>
			</div>
		</div>
		<!-- //.item -->
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const onBoardDetail = id => {
	router.push(`/board/${id}`);
};
</script>
