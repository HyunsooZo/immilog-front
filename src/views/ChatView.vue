<template>
	<div class="content">
		<SearchBar />

		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
			<div class="fnc-wrap">
				<div class="category__list">
					<button type="button" class="button--select" @click="openCategorySelect">
						<span>selectCategoryValue.name</span>
					</button>
				</div>
				<div class="sort__list">
					<button type="button" class="button--select sort" @click="openSortingSelect">
						<span>selectSortingValue.name</span>
					</button>
				</div>
			</div>
		</div>

		<div class="list-wrap chat">
			<div class="item">
				<button type="button" class="list__item_button">
					<div class="info__wrap">
						<div class="item__pic pic--default">
							<!-- <img src="" alt="" /> -->
						</div>
						<div class="item__fnc">
							<div class="list__item user">
								<em>post.region</em>
								<strong>post.userNickName</strong>
							</div>
						</div>
					</div>
					<div class="text__wrap">
						<div class="list__item">
							<div class="text__item">
								<p class="text">chat.content</p>
							</div>
						</div>
					</div>
					<div class="util__wrap">
						<div class="item__fnc">
							<p class="list__item past">
								<i class="blind">작성시간</i>
								<span class="item__count">chat.createdAt</span>
							</p>
						</div>
					</div>
				</button>
				<div class="item__fnc">
					<button type="button" class="list__item_button more">
						<i class="blind">더보기</i><!-- //신고, 나가기 -->
					</button>
				</div>
			</div><!-- // .item -->
		</div>
	</div>
</template>

<script setup>
import SearchBar from '@/components/SearchBar.vue';
</script>
