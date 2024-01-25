<template>
  <div class="content">
    <!-- 검색 -->
    <div class="search-wrap">
      <!-- 버튼형 -->
      <div class="input-wrap">
        <div class="input__inner">
          <p class="logo-wrap">
            <img src="@/assets/images/icon-komeet.png" alt="ko-meet" />
          </p>
          <button class="button input__button-search" role="link">
            <span>관심 있는 글 검색</span>
          </button>
        </div>
      </div>
      <!-- 검색 -->
      <div class="input-wrap">
        <div class="input__inner search">
          <input type="search" id="inputSrch" class="input__element input__element--search" placeholder="검색어를 입력해 주세요"
            autocomplete="off" />
          <button type="button" class="input__button-remove" title="텍스트삭제"></button>
          <button type="button" id="btnSrch" class="input__button-search" title="검색"></button>
        </div>
      </div>
    </div>

    <!-- 검색어(해시태그) -->
    <div class="search-option-wrap" style="display: none">
      <div class="search-option hash-search__tag" data-element="tab__panel" role="tabpanel">
        <div class="search-option-inner">
          <div class="tag-area hide">
            <button type="button" class="btn-hash">#해시태그</button>
            <button type="button" class="btn-hash">#해시태그</button>
            <button type="button" class="btn-hash">#해시태그</button>
            <button type="button" class="btn-hash">#해시태그</button>
          </div>
          <!-- 버튼 -->
          <div class="btn-area">
            <button type="button" class="btn-close">접기</button>
          </div>
        </div>
      </div>
    </div>

    <!-- tab button -->
    <div class="menu-wrap">
      <ul class="menu__inner">
        <li v-for="(menu, index) in menus" :key="index" :class="{ active: menu.active }" class="menu__list">
          <button @click="selectMenu(menu)" type="button" class="button" :aria-selected="menu.active.toString()">
            {{ menu.label }}
          </button>
        </li>
      </ul>
      <span class="menu__bar" v-if="isActive" :style="{ left: buttonPosition, width: buttonWidth }"></span>
    </div>

    <!--  -->
    <div class="flexbox-wrap border--bot">
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
        <span>카테고리</span>
      </p>
      <div class="item">
        <div class="info__wrap">
          <div class="item-fnc">
            <button type="button" class="list__item_button ctg">
              <em>국가</em>
              <strong>카테고리</strong>
            </button>
          </div>
          <div class="item-fnc">
            <button type="button" class="list__item_button user">
              <em>작성자</em>
              <strong>닉네임</strong>
            </button>
          </div>
        </div>
        <div class="text__wrap">
          <button type="button" class="list__item_button text-link">
            <p class="title">글제목 글제목 글제목 글제목 글제목 글제목 글제목 글제목 글제목</p>
            <p class="text">
              내용미리보기 내용미리보기 내용미리보기 내용미리보기 내용미리보기 내용미리보기
              내용미리보기 내용미리보기 내용미리보기 내용미리보기
            </p>
          </button>
        </div>
        <div class="util__wrap">
          <div class="item-fnc">
            <p class="list__item read">
              <i class="blind">조회수</i>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye"
                viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
              <span class="item__count">10</span>
            </p>
            <button type="button" class="list__item_button like">
              <i class="blind">좋아요</i>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-hand-thumbs-up" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
              </svg>
              <span class="item__count">10</span>
            </button>
            <p class="list__item cmt">
              <i class="blind">댓글</i>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right"
                viewBox="0 0 16 16">
                <path
                  d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
              </svg>
              <span class="item__count">10</span>
            </p>
          </div>
          <div class="item-fnc">
            <p class="list__item past">
              <i class="blind">작성시간</i>
              <span class="item__count">10시간 전</span>
            </p>
            <button type="button" class="list__item_button mark active">
              <!-- //북마크 활성화 .active -->
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house"
            viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
          </svg>
          <span>홈</span>
        </button>
      </li>
      <li class="util__item">
        <button type="button" class="item area">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag"
            viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z" />
          </svg>
          <span>내지역</span>
        </button>
      </li>
      <li class="util__item">
        <button type="button" class="item chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right-dots"
            viewBox="0 0 16 16" aria-hidden="true">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-building-check"
            viewBox="0 0 16 16" aria-hidden="true">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-gear"
            viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
          </svg>
          <span>마이페이지</span>
        </button>
      </li>
    </ul>
  </div>

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
            <li class="item">
              <button type="button" class="button">전체</button>
            </li>
            <li class="item">
              <button type="button" class="button">인기글</button>
            </li>
            <li class="item">
              <button type="button" class="button">내지역</button>
            </li>
            <li class="item">
              <button type="button" class="button">구인구직</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TheFooter from '@/components/layouts/TheFooter.vue';
import { computed, onMounted, ref } from 'vue';

const isActive = ref(false);
const buttonPosition = ref('0px');
const buttonWidth = ref('0px');
let menus = [
  { label: '최신글', active: true },
  { label: '인기글', active: false }
  // Add more menu items as needed
];

const checkButtonActive = () => {
  const activeMenu = menus.find((menu) => menu.active);
  if (activeMenu) {
    menu__bar(activeMenu);
  }
};

const selectMenu = (selectedMenu) => {
  selectedMenu.active = true;
  isActive.value = true;
  resetMenus(selectedMenu);
  menu__bar(selectedMenu);
};

const resetMenus = (selectedMenu) => {
  menus.forEach((menu) => {
    if (menu !== selectedMenu) {
      menu.active = false;
    }
  });
};

const menu__bar = (activeMenu) => {
  const activeButton = document.querySelector('.menu__list.active .button');
  const mp = activeButton ? `${activeButton.offsetLeft}px` : '0px';
  const wd = activeButton ? `${activeButton.offsetWidth}px` : '0px';
  buttonPosition = mp;
  buttonWidth = wd;
};

onMounted(() => {
  checkButtonActive();
});
</script>
