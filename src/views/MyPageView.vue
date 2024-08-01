<template>
  <div class="content">
    <!-- 개인정보 -->
    <div class="list-wrap _personal">
      <div class="item">
        <button type="button" class="list__item_button" @click="onProfileEdit">
          <div class="info__wrap">
            <div class="item__image" :class="{ 'image--default': !userInfo.userProfileUrl }">
              <img v-if="userInfo.userProfileUrl" :src="userInfo.userProfileUrl" alt="" />
            </div>
            <div class="item__fnc">
              <div class="list__item">
                <em v-if="loginStatus">{{ t('countries.' + userInfo.userCountry) }}</em>
                <em v-if="loginStatus">{{ userInfo.userRegion }}</em>
              </div>
              <div class="list__item user button-text">
                <strong>{{ userInfo.userNickname ? userInfo.userNickname : t('myPageView.login') }}
                </strong>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
    <!--  -->
    <div class="list-wrap list--link">
      <ul v-if="loginStatus">
        <li class="item">
          <button type="button" class="button button-text" @click="onMyBoard">
            <svg viewBox="0 0 16 16">
              <path :d="myPostIcon" />
            </svg>
            <span>{{ t('myPageView.myPosts') }}</span>
          </button>
        </li>
        <li class="item">
          <button type="button" class="button button-text" @click="onBookmark">
            <svg viewBox="0 0 16 16">
              <path fill-rule="evenodd" :d="bookmarkIcon.first" />
              <path :d="bookmarkIcon.second" />
            </svg>
            <span>{{ t('myPageView.bookMark') }}</span>
          </button>
        </li>
      </ul>
      <ul>
        <li class="item" v-if="loginStatus">
          <button type="button" class="button button-text" @click="onNotificationModal">
            <svg viewBox="0 0 16 16">
              <path :d="noticeIcon.first" />
              <path :d="noticeIcon.second" />
            </svg>
            <span>{{ t('myPageView.notice') }}</span>
          </button>
        </li>
        <li class="item">
          <button type="button" class="button button-text" @click="openEmailForm">
            <svg viewBox="0 0 16 16">
              <path :d="customerCenterIcon.first" />
              <path :d="customerCenterIcon.second" />
            </svg>
            <span>{{ t('myPageView.customerService') }}</span>
          </button>
        </li>
        <li class="item" v-if="loginStatus">
          <button type="button" class="button" @click="signOut">
            <svg viewBox="0 0 16 16">
              <path :d="logoutIcon.first" />
              <path :d="logoutIcon.second" />
            </svg>
            <span>{{ t('myPageView.logout') }}</span>
          </button>
        </li>
      </ul>
      <ul v-if="loginStatus">
        <li class="item">
          <button type="button" class="button button-text" @click="onCompanyInfo">
            <svg viewBox="0 0 16 16">
              <path :d="companyInfoIcon.first" />
              <path :d="companyInfoIcon.second" />
              <path :d="companyInfoIcon.third" />
            </svg>
            <span>{{ t('myPageView.companyInfo') }}</span>
          </button>
        </li>
      </ul>
      <ul>
        <li class="item">
          <div class="check">
            <svg viewBox="0 0 16 16">
              <path :d="settingIcon.first" />
              <path :d="settingIcon.second" />
            </svg>
            <span>{{ t('myPageView.settings') }}</span>
            <div class="input__item _switch-toggle">
              <input type="checkbox" class="input__checkbox" name="setting" id="setting" v-model="isEnglishChecked" />
              <label for="setting" class="input__label"><span class="blind">{{
          isEnglishChecked ? t('myPageView.english') : t('myPageView.korean') }}</span></label>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <BookMark @update:bookmarkValue="offBookMark" v-if="isBookmarkOn" />
    <UserBoard :userSeq="userInfo.userSeq ? userInfo.userSeq : 0" @close="offUserBoard" v-if="isUserBoardOn" />
    <CompanyInfo v-if="isCompanyInfo" @close="offCompanyInfo" />
  </div>
  <teleport to="#modal" v-if="modalValue">
    <ConfirmModal :modalText="modalText" @modalValue="closeModal" />
  </teleport>
  <NotificationModal v-if="isNotificationModal" @close="offNotificationModal" />
</template>

<script setup lang="ts">
import BookMark from '@/components/board/BookMark.vue'
import UserBoard from '@/components/board/UserBoard.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import CompanyInfo from '@/components/board/CompanyInfo.vue'
import { useUserInfoStore } from '@/stores/userInfo.ts'
import { onMounted, ref, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import {
  myPostIcon,
  bookmarkIcon,
  settingIcon,
  noticeIcon,
  customerCenterIcon,
  logoutIcon,
  companyInfoIcon
} from '@/utils/icons.ts'
import { useI18n } from 'vue-i18n'
import NotificationModal from '@/components/notification/NotificationModal.vue'

const { t, locale } = useI18n()
const router = useRouter()
const userInfo = useUserInfoStore()
const loginStatus = ref(false)
const isEnglishChecked = ref(localStorage.getItem('language') === 'en')

// 컴퓨티드 속성으로 언어 설정
const changeLanguage = computed(() => {
  return isEnglishChecked.value ? 'en' : 'ko'
})

// 언어 변경을 감지하여 localStorage와 locale 업데이트
watchEffect(() => {
  const language = changeLanguage.value
  localStorage.setItem('language', language)
  locale.value = language
})

// modal open/close 시 body 컨트롤
const isModalOpen = () => {
  document.body.classList.add('inactive')
}
const isModalClose = () => {
  document.body.classList.remove('inactive')
}

// 프로필 수정 페이지로 이동
const onProfileEdit = () => {
  if (loginStatus.value === false) {
    return router.push('/sign-in')
  }
  router.push(`/profile-edit`)
}

// 내 게시물 표시 상태
const isUserBoardOn = ref(false)
const onMyBoard = () => {
  isUserBoardOn.value = true
  isModalOpen()
}
const offUserBoard = () => {
  isUserBoardOn.value = false
  isModalClose()
}

// 북마크 표시 상태
const isBookmarkOn = ref(false)
const onBookmark = () => {
  isBookmarkOn.value = true
  isModalOpen()
}
const offBookMark = () => {
  isBookmarkOn.value = false
  isModalClose()
}

// 공지사항
const isNotificationModal = ref(false)
const onNotificationModal = () => {
  isNotificationModal.value = true
}
const offNotificationModal = () => {
  isNotificationModal.value = false
}

// 회사등록
const isCompanyInfo = ref(false)
const onCompanyInfo = () => {
  isCompanyInfo.value = true
}
const offCompanyInfo = () => {
  isCompanyInfo.value = false
}

// 고객센터 이메일 폼
const openEmailForm = () => {
  const { userEmail, userNickname, userCountry } = userInfo || {} // userInfo가 정의되지 않은 경우를 대비
  const deviceInfo = navigator.userAgent
  const appVersion = '앱 버전'
  const osVersionMatch = navigator.userAgent.match(/(?:\w+\s)?(?:\w+\s)?(?:\w+\/)?([\d._]+)/)
  const osVersion = osVersionMatch ? osVersionMatch[1] : 'N/A'
  const email = 'immilog@gmail.com'
  const subject = '[immilog] 문의/요청/신고 합니다'
  const body = `\n\n--------------------\n이메일: ${userEmail || 'N/A'}\n닉네임: ${userNickname || 'N/A'}\n접속국가: ${userCountry || 'N/A'}\n기기 정보: ${deviceInfo}\n앱 버전: ${appVersion}\nOS 버전: ${osVersion}`
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  window.location.href = mailtoLink
}

// 모달 상태
const modalValue = ref(false)
const modalText = ref('로그아웃 하시겠습니까?')
const closeModal = () => {
  modalValue.value = false
}

// 로그아웃 처리
const signOut = () => {
  userInfo.signOut()
  removeTokens()
  router.push('/sign-in')
}

const removeTokens = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

// 사용자 정보 확인 후 로그인 페이지로 리다이렉트
onMounted(async () => {
  if (userInfo.userNickname) {
    loginStatus.value = true
  }
})

</script>
