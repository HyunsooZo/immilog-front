<template>
	<div class="content">
		<div class="top-wrap">
			<p class="logo-wrap">
				<img src="@/assets/images/icon-komeet.png" alt="ko-meet" />
			</p>
			<div class="search-wrap">
				<button class="button button--search" role="link">
					<span>검색</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-search"
						viewBox="0 0 16 16"
					>
						<path
							d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!--  -->
		<div class="container">
			<!-- tab button -->
			<div>탭 구분</div>
		</div>

		<!--  -->
		<div class="category-wrap">
			<em class="blind">카테고리</em>
			<div class="category__list">
				<button type="button" class="button--select">전체</button>
			</div>
			<div class="sort__list">
				<button type="button" class="button--select sort">최신순</button>
			</div>
		</div>

		<!-- 목록 -->
		<div class="list-wrap">
			<p class="list__title">
				<span>게시판이름</span>
			</p>
			<div class="item">
				<p class="ctg__wrap">
					<a href="/">카테고리명</a>
				</p>
				<p class="text__wrap">
					<a href="/" class="text__item">
						<p class="title">글제목</p>
						<p class="text">내용미리보기</p>
					</a>
				</p>
				<div class="info__wrap">
					<p class="item-fnc">
						<a href="/" class="pv"><i class="blind">조회수</i>10</a>
						<a href="/" class="like"><i class="blind">좋아요</i>10</a>
						<a href="/" class="cmt"><i class="blind">댓글</i>10</a>
					</p>
					<p class="item-fnc">
						<a href="/" class="past"><i class="blind">작성시간</i>10</a>
						<a href="/" class="mark"><i class="blind">북마크</i>10</a>
					</p>
				</div>
			</div>
			<!-- //.item -->
		</div>
	</div>
	<TheFooter />
	<!-- selectdialog -->
	<div class="modal-container select--dialog" style="display: none">
		<div class="modal" tabindex="-1" role="dialog">
			<div class="modal-content">
				<div class="modal-header">
					<p class="modal-title">카테고리 선택</p>
					<button type="button" class="button-icon button--close" role="link">
						<span>닫기</span>
					</button>
				</div>
				<div class="modal-body">
					<ul class="list-wrap">
						<li class="item"><a href="/">전체</a></li>
						<li class="item"><a href="/">인기글</a></li>
						<li class="item"><a href="/">내지역</a></li>
						<li class="item"><a href="/">구인구직</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import TheFooter from '@/components/layouts/TheFooter.vue';
</script>
