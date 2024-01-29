<template>
	<TheHeader />
	<div class="content">
		<!-- 글 상세 -->
		<div class="list-wrap">
			<p class="list__title">
				<span>카테고리</span>
			</p>
			<div v-for="(post, index) in posts" :key="index" class="item">
				<div class="info__wrap">
					<div class="item__pic">
						<img :src="post.imageSrc" alt="post image" />
					</div>
					<div class="item-fnc">
						<div class="list__item">
							<button type="button" class="list__item_button ctg">
								<em>{{ post.country }}</em>
								<strong>{{ post.category }}</strong>
							</button>
						</div>
						<div class="list__item">
							<button type="button" class="list__item_button user">
								<em>작성자</em>
								<strong>{{ post.author }}</strong>
							</button>
						</div>
					</div>
				</div>
				<div class="text__wrap">
					<div class="list__item">
						<p class="title">{{ post.title }}</p>
						<p class="text">{{ post.content }}</p>
					</div>
				</div>
				<div class="tag-wrap">
					<div class="tag__inner">
						<div class="tag__item">
							<button
								v-for="tag in post.tags"
								:key="tag"
								type="button"
								class="button button--hash"
							>
								<em>{{ tag }}</em>
							</button>
						</div>
					</div>
				</div>
				<div class="util__wrap">
					<div class="item-fnc">
						<button
							type="button"
							class="list__item_button like"
							:class="{ active: post.isLiked }"
						>
							<i class="blind">좋아요</i>
							<span class="item__count">{{ post.likes }}</span>
						</button>
						<button type="button" class="list__item cmt">
							<i class="blind">댓글</i>
							<span class="item__count">{{ post.comments }}</span>
						</button>
						<p class="list__item past">
							<i class="blind">작성시간</i>
							<span class="item__count">{{
								timeCalculation(post.timeAgo)
							}}</span>
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
				<button
					type="button"
					class="button--select sort"
					@click="openSortingSelect"
				>
					{{ selectSortingValue.name }}
				</button>
			</div>
			<div class="sort__list">
				<button type="button" class="button--icon last-reply">
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
							<span class="item__count">대댓글</span>
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
								<button
									type="button"
									class="list__item_button user user--author"
								>
									<!-- //원글작성자 댓글 .user--author -->
									<em>원글작성자 대댓글</em>
									<strong>원글작성자 닉네임</strong>
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
				<!-- n개 이상 대댓글 더보기 -->
				<div class="item item__more">
					<button type="button" class="list__item_button button-text">
						<span>대댓글 <em>n</em>개 더보기</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	<SelectDialog
		v-if="isSortingSelectClicked"
		:title="selectTitle"
		:list="selectList"
		@close="closeSelect"
		@select:value="selectedValue"
	/>
</template>

<script setup>
import TheHeader from '@/components/layouts/TheHeader.vue';
import SelectDialog from '@/components/SelectDialog.vue';
import { ref } from 'vue';

//테스트
const posts = ref([
	{
		id: 1,
		imageSrc: 'https://picsum.photos/200/300',
		country: '한국',
		category: '카테고리',
		title: '테스트 글제목',
		content: '테스트 글내용',
		likes: 3,
		comments: 2,
		timeAgo: '2024-01-28',
	},
]);
const selectTitle = ref('정렬 방식 선택');
const isSortingSelectClicked = ref(false);
const selectSortingValue = ref({ name: '최신순', code: 'recent' });
const selectList = [
	{ name: '최신순', code: 'recent' },
	{ name: '좋아요순', code: 'like' },
	{ name: '조회순', code: 'view' },
	{ name: '댓글순', code: 'comment' },
];

const selectedValue = value => {
	selectSortingValue.value = value;
	//정렬 변경
};

const openSortingSelect = () => {
	isSortingSelectClicked.value = true;
};
const closeSelect = () => {
	isSortingSelectClicked.value = false;
};

const timeCalculation = localTime => {
	// LocalDateTime 문자열을 JavaScript Date 객체로 변환
	const postDate = new Date(localTime);
	const now = new Date();
	const diff = now.getTime() - postDate.getTime();

	// 시간 차이를 분 단위로 변환
	const diffMinutes = Math.floor(diff / (1000 * 60));

	if (diffMinutes < 10) {
		return '방금 전';
	} else if (diffMinutes < 60) {
		return `${Math.ceil(diffMinutes / 10) * 10}분 전`;
	}

	// 시간 차이를 시간 단위로 변환
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}시간 전`;
	}

	// 하루 이상 차이 나는 경우 날짜 포맷으로 반환
	return postDate.toLocaleString('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};
</script>
