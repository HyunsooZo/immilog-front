<template>
	<div class="content">
		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
			<div class="fnc-wrap _search">
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
				<div class="search-wrap" :class="{ 'active': isSearchOpen }">
					<div class="input-wrap">
						<div class="input__inner">
							<button class="button button--search" role="link" @click="openSearchInput">
								<i class="blind">채팅 검색</i>
							</button>
							<div class="input__inner-wrap">
								<div class="input__inner-item">
									<input v-model="searchInput" type="search" id="inputSrch" class="input__element input__element--search"
										placeholder="검색어를 입력 후 엔터를 눌러주세요" autocomplete="off" @keyup.enter="callSearchApi" />
									<button v-if="searchInput !== ''" type="button" class="input__button-remove" title="텍스트삭제"
										@click="initializeSearchInput"></button>
								</div>
								<button class="button button--close" role="link" @click="closeSearchInput">
									<i class="blind">취소</i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="list-wrap chat">
			<div class="item">
				<button type="button" class="list__item_button" @click="onChatDetail">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isSearchOpen = ref(false);
const searchInput = ref('');
const router = useRouter();

const initializeSearchInput = () => {
	searchInput.value = '';
};

const openSearchInput = () => {
	isSearchOpen.value = true;
};
const closeSearchInput = () => {
	isSearchOpen.value = false;
	searchInput.value = '';
};

const onChatDetail = () => {
	router.push({ name: 'ChatDetail' });
};
</script>
