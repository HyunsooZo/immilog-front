<template>
	<!-- 검색 -->
	<!-- <div class="input-wrap">
        <div class="input__inner search">
          <input v-model="searchInput" type="search" id="inputSrch" class="input__element input__element--search"
          placeholder="검색어를 입력해 주세요" autocomplete="off" />
          <button v-if="searchInput !== ''" type="button" class="input__button-remove" title="텍스트삭제"
          @click="searchInput = ''"></button>
          <button type="button" id="btnSrch" class="input__button-search" title="검색" @click="callSearchApi"></button>
        </div>
      </div> -->
	<div class="input-wrap">
		<p class="logo-wrap">
			<img src="@/assets/images/icon-komeet.png" alt="ko-meet" />
		</p>
		<div class="input__inner">
			<button class="button button--search" role="link">
				<span class="blind">관심 있는 글 검색</span>
			</button>
			<div class="input__inner-item">
				<input
					v-model="searchInput"
					type="search"
					id="inputSrch"
					class="input__element input__element--search"
					placeholder="검색어를 입력해 주세요"
					autocomplete="off"
				/>
				<button
					v-if="searchInput !== ''"
					type="button"
					class="input__button-remove"
					title="텍스트삭제"
					@click="searchInput = ''"
				></button>
				<!-- <button type="button" id="btnSrch" class="input__button-search" title="검색" @click="callSearchApi"></button> -->
			</div>
			<button class="button button--back" role="link">
				<span class="blind">취소</span>
			</button>
		</div>
		<button type="button" class="button-icon button--notice new" role="link">
			<span>알림</span>
		</button>
	</div>
	<div class="search-result-wrap">
		<ul class="search-result">
			<li class="item">
				<button type="button" class="button button--result-recently">
					<em>최근검색기록</em>
				</button>
				<p class="item-fnc">
					<button type="button" class="button button--del">
						<span class="blind">삭제</span>
					</button>
				</p>
			</li>
			<li class="item">
				<button type="button" class="button button--result-recently">
					<em>최근검색기록</em>
				</button>
				<p class="item-fnc">
					<button type="button" class="button button--del">
						<span class="blind">삭제</span>
					</button>
				</p>
			</li>
			<li class="item">
				<button type="button" class="button button--result">
					<em>검색결과</em>
				</button>
			</li>
			<li class="item">
				<button type="button" class="button button--result">
					<em>검색결과</em>
				</button>
			</li>
			<li class="item">
				<button type="button" class="button button--result">
					<em>검색결과</em>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
