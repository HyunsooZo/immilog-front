<template>
  <div class="content">
    <!-- 검색 -->
    <div class="search-wrap">
      <div class="input-wrap">
        <p class="logo-wrap">
          <img src="@/assets/images/icon-komeet.png" alt="ko-meet" />
        </p>
        <div class="input__inner">
          <button class="button button--search" role="link">
            <span class="blind">관심 있는 글 검색</span>
          </button>
          <div class="input__inner-item">
            <input v-model="searchInput" type="search" id="inputSrch" class="input__element input__element--search"
              placeholder="검색어를 입력해 주세요" autocomplete="off" />
            <button v-if="searchInput !== ''" type="button" class="input__button-remove" title="텍스트삭제"
              @click="searchInput = ''"></button>
          </div>
          <button class="button button--back" role="link">
            <span class="blind">취소</span>
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

  <!-- footer -->
  <div class="footer">
    <ul class="util-item-wrap">
      <li class="util__item">
        <button type="button" class="item home active">
          <!-- //활성화 .active -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
          </svg>
          <span>홈</span>
        </button>
      </li>
      <li class="util__item">
        <button type="button" class="item area">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z" />
          </svg>
          <span>내지역</span>
        </button>
      </li>
      <li class="util__item">
        <button type="button" class="item chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
            <path
              d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
          <span>채팅</span>
        </button>
      </li>
      <li class="util__item">
        <button type="button" class="item job">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514Z" />
            <path
              d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6.5a.5.5 0 0 1-1 0V1H3v14h3v-2.5a.5.5 0 0 1 .5-.5H8v4H3a1 1 0 0 1-1-1V1Z" />
            <path
              d="M4.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm-6 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm-6 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z" />
          </svg>
          <span>구인/구직</span>
        </button>
      </li>
      <li class="util__item">
        <button type="button" class="item my">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
          </svg>
          <span>마이페이지</span>
        </button>
      </li>
    </ul>
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
