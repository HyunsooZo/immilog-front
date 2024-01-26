<template>
	<div class="content">
		<!-- 상단 고정 영역 -->
		<div class="sticky-wrap active"><!-- //scroll up addClass .active / scroll down removeClass .active -->
			<!-- 검색 -->
			<div class="search-wrap">
				<div class="input-wrap">
					<p class="logo-wrap">
						<img src="@/assets/images/icon-komeet.png" alt="ko-meet" />
					</p>
					<div class="input__inner">
						<button class="button button--search" role="link">
							<span>관심 있는 글 검색</span>
						</button>
					</div>
					<button type="button" class="button-icon button--notice new" role="link">
						<span>알림</span>
					</button>
				</div>
			</div>

			<!-- tab button -->
			<div class="menu-wrap">
				<ul class="menu__inner">
					<li v-for="(menu, index) in menus" :key="index" :class="{ active: menu.active.value }" class="menu__list">
						<button @click="selectMenu(menu)" type="button" class="button" :aria-selected="menu.active.value.toString()">
							{{ menu.label }}
						</button>
					</li>
				</ul>
				<span class="menu__bar" :style="{ left: menuBarLeft, width: menuBarWidth }"></span>
			</div>
		</div>

		<!-- 목록 -->
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
					<button type="button" class="list__item_button text-link">
						<p class="title">
							글제목 글제목 글제목 글제목 글제목 글제목 글제목 글제목 글제목
						</p>
						<p class="text">
							내용미리보기 내용미리보기 내용미리보기 내용미리보기 내용미리보기
							내용미리보기 내용미리보기 내용미리보기 내용미리보기 내용미리보기
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
	</div>
</template>

<script setup>

</script>
