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

    <!--  -->
    <div class="flexbox-wrap border--bot">
      <div class="category__list">
        <button type="button" class="button--select" @click="openCategorySelect">
          {{ selectCategoryValue.name }}
        </button>
      </div>
      <div class="sort__list">
        <button type="button" class="button--select sort" @click="openSortingSelect">
          {{ selectSortingValue.name }}
        </button>
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


  <SelectDialog v-if="isCategorySelectClicked || isSortingSelectClicked" :title="selectTitle" :list="selectList"
    @close="closeSelect" @select:value="selectedValue" />
</template>

<script setup>
// import TheFooter from '@/components/layouts/TheFooter.vue';
import { nextTick, onMounted, ref } from 'vue';
import SelectDialog from '@/components/SelectDialog.vue';
const searchInput = ref('');
const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');
const selectTitle = ref('');
const selectList = ref('');
const isCategorySelectClicked = ref(false);
const isSortingSelectClicked = ref(false);
const selectCategoryValue = ref({ name: '전체', code: 'all' });
const selectSortingValue = ref({ name: '최신순', code: 'recent' });
const sortingList = [
  { name: '최신순', code: 'recent' },
  { name: '좋아요순', code: 'like' },
  { name: '조회순', code: 'view' },
  { name: '댓글순', code: 'comment' },
];
const categoryList = [
  { name: '전체', code: 'all' },
  { name: '워킹홀리데이', code: 'workingholiday' },
  { name: '영주권', code: 'greencard' },
  { name: '소통', code: 'communication' },
  { name: '질문/답변', code: 'qanda' },
];

let menus = [
  { label: '최신글', active: ref(true) },
  { label: '인기글', active: ref(false) },
];

const selectMenu = selectedMenu => {
  selectedMenu.active.value = true;
  menus
    .filter(menu => menu !== selectedMenu)
    .forEach(menu => {
      menu.active.value = false;
    });
  nextTick(() => {
    updateMenuBar();
  });
};

// const callSearchApi = () => {
// 	console.log('callSearchApi');
// };

const openCategorySelect = () => {
  nextTick(() => {
    selectTitle.value = '카테고리 선택';
    selectList.value = categoryList;
    isCategorySelectClicked.value = true;
  });
};

const openSortingSelect = () => {
  nextTick(() => {
    selectTitle.value = '정렬 기준 선택';
    selectList.value = sortingList;
    isSortingSelectClicked.value = true;
  });
};

const updateMenuBar = () => {
  const activeButton = document.querySelector('.menu__list.active .button');
  menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
  menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

const selectedValue = value => {
  if (categoryList.some(c => c.code === value.code)) {
    selectCategoryValue.value = value;
  } else if (sortingList.some(s => s.code === value.code)) {
    selectSortingValue.value = value;
  }
};

const closeSelect = () => {
  isCategorySelectClicked.value = false;
  isSortingSelectClicked.value = false;
  inquireBoardList(selectCategoryValue.value, selectSortingValue.value);
};

const inquireBoardList = (category, sorting) => {
  console.log(category, sorting);
  console.log('inquireBoardList');
};

onMounted(() => {
  updateMenuBar();
});
</script>
