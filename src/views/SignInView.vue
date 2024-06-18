<template>
  <LoadingModal v-if="isLoading" />

  <div class="content">
    <!-- 로그인 -->
    <div class="container">
      <!-- email -->
      <div class="input-wrap">
        <em class="input__title">{{ t('signInView.email') }}</em>
        <!-- input__wrap -->
        <div class="input__wrap underline-type">
          <div class="input__item">
            <div class="input__item_inner">
              <input
                v-model="email"
                type="text"
                class="input__element"
                :placeholder="t('signInView.emailPlaceHolder')"
                id="inputEmail"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <!-- password -->
      <div class="input-wrap">
        <em class="input__title">{{ t('signInView.password') }}</em>
        <!-- input__wrap -->
        <div class="input__wrap underline-type">
          <div class="input__item">
            <div class="input__item_inner">
              <input
                v-model="password"
                type="password"
                class="input__element"
                :placeholder="t('signInView.passwordPlaceHolder')"
                id="inputPassword"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div class="button-wrap link-type">
        <button type="button" class="button-text">
          <strong>{{ t('signInView.passwordReset') }}</strong>
        </button>
      </div>

      <div class="button-wrap">
        <button
          @click="signIn"
          :class="{
            'button button--positive': isValidLogin && !isLoading,
            'button button--disabled': !isValidLogin || isLoading
          }"
          role="link"
          id="loginBtn"
        >
          {{ t('signInView.signIn') }}
        </button>
        <!-- //버튼 활성 .button--positive / 비활성 .button--disabled -->
      </div>

      <div class="input-wrap">
        <div class="input__wrap">
          <div class="input__item">
            <input type="checkbox" class="input__checkbox _text" id="loginSave" name="loginSave" />
            <label for="loginSave" class="input__label">{{ t('signInView.autoSignIn') }}</label>
          </div>
        </div>
      </div>
    </div>

    <!-- signin -->
    <div class="signin-group-wrap">
      <div class="title--small">
        <span>{{ t('signInView.or') }}</span>
      </div>
      <ul class="signin-group">
        <li class="item">
          <button type="button" class="button-icon button--signin-google" @click="loginByGoogle">
            <i class="blind">{{ t('signInView.googleLogin') }}</i>
          </button>
        </li>
        <li class="item">
          <button type="button" class="button-icon button--signin-kakao" @click="loginByKakao">
            <i class="blind">{{ t('signInView.kakaoTalkLogin') }}</i>
          </button>
        </li>
        <li class="item">
          <button type="button" class="button-icon button--signin-naver" @click="loginByNaver">
            <i class="blind">{{ t('signInView.naverLogin') }}</i>
          </button>
        </li>
      </ul>
    </div>

    <div class="container">
      <ul>
        <li>
          <strong>{{ t('signInView.ifYouDoNotHaveAnAccount') }}</strong>
          <button type="button" class="button-text" role="link" @click="onSignUp">
            <strong>{{ t('signInView.signUp') }}</strong>
          </button>
        </li>
      </ul>
    </div>
  </div>
  <teleport to="#modal" v-if="alertValue">
    <CustomAlert :alertValue="alertValue" :alertText="alertText" @update:alertValue="closeAlert" />
  </teleport>
</template>

<script setup lang="ts">
import type { IUserInfo } from '@/types/interface'
import type { IApiUserInfo } from '@/types/api-interface'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo.ts'
import { getCoordinate } from '@/services/geolocation.ts'
import { getUserInfo } from '@/services/userInfoFetch.ts'
import { useI18n } from 'vue-i18n'
import { applicationJson } from '@/utils/header'
import { AxiosResponse } from 'axios'
import CustomAlert from '@/components/modal/CustomAlert.vue'
import LoadingModal from '@/components/loading/LoadingModal.vue'
import api from '@/api'

const { t } = useI18n()

const email = ref('')
const password = ref('')
const router = useRouter()

// 로그인 버튼 활성화 여부
const isValidLogin = computed(() => email.value && password.value)

// 회원가입 화면으로 이동
const onSignUp = () => {
  router.push({ name: 'SignUp' })
}

// 로그인
const signIn = async () => {
  onLoading()
  try {
    const requestForm = {
      email: email.value,
      password: password.value,
      latitude: localStorage.getItem('latitude'),
      longitude: localStorage.getItem('longitude')
    }
    const response: AxiosResponse<IApiUserInfo> = await api.post(
      '/users/sign-in',
      requestForm,
      applicationJson
    )
    console.log(response)
    if (response.status === 200) {
      useUserInfoStore().setUserInfo(response.data.data)
      setToken(response.data.data)
      setTimeout(() => {
        offLoading()
        router.push({ name: 'Home' })
      }, 1000)
    } else if (
      response.status === 200 &&
      response.data.message === '비밀번호가 일치하지 않습니다.'
    ) {
      password.value = ''
      openAlert(t('signInView.passwordNotMatch'))
    } else if (
      response.status === 200 &&
      response.data.message === '사용자 상태가 활성화되어 있지 않습니다.'
    ) {
      openAlert(t('signInView.notAnActiveUser'))
    } else {
      password.value = ''
      openAlert(t('signInView.failedToSignIn'))
    }
  } catch (error: any) {
    console.log(error)
    if (
      error.response.status === 400 &&
      error.response.data.message === '이메일 형식에 맞게 입력해주세요.'
    ) {
      openAlert(t('signInView.invalidEmailFormat'))
    } else if (
      error.response.status === 400 &&
      error.response.data.message === '비밀번호는 8자에서 15자여야 합니다.'
    ) {
      openAlert(t('signInView.passwordLengthError'))
    }
    openAlert(t('signInView.failedToConnect'))
  } finally {
    setTimeout(() => {
      offLoading()
    }, 2000)
  }
}

// <-- 알럿 관련
const alertValue = ref(false)
const alertText = ref('')

const openAlert = (content: string) => {
  alertValue.value = true
  alertText.value = content
}

const closeAlert = () => {
  alertValue.value = false
}
// -->

// <-- 로딩 관련
const isLoading = ref(false)

const onLoading = () => {
  isLoading.value = true
}

const offLoading = () => {
  isLoading.value = false
}
// -->

const setToken = (data: IUserInfo) => {
  localStorage.setItem('accessToken', data.accessToken ? data.accessToken : '')
  localStorage.setItem('refreshToken', data.refreshToken ? data.refreshToken : '')
}

const loginByGoogle = async () => {
  try {
    onLoading()
    const response: AxiosResponse<IApiUserInfo> = await api.get(
      '/users/sign-in/google',
      applicationJson
    )

    console.log('loginByGoogle')
    if (response.status === 200) {
      useUserInfoStore().setUserInfo(response.data.data)
      setToken(response.data.data)
      setTimeout(() => {
        offLoading()
        router.push({ name: 'Home' })
      }, 2000)
    } else {
      password.value = ''
      openAlert(t('signInView.failedToSignIn'))
    }
  } catch (error) {
    console.log(error)
    openAlert(t('signInView.failedToConnect'))
  } finally {
    setTimeout(() => {
      offLoading()
    }, 2000)
  }
}

const loginByKakao = async () => {
  try {
    onLoading()

    const response: AxiosResponse<IApiUserInfo> = await api.get(
      '/users/sign-in/kakao',
      applicationJson
    )
    console.log('loginByKakao')
    onLoading()
  } catch (error) {
    console.log(error)
    openAlert(t('signInView.failedToConnect'))
  } finally {
    setTimeout(() => {
      offLoading()
    }, 2000)
  }
}

const loginByNaver = async () => {
  try {
    onLoading()

    const response: AxiosResponse<IApiUserInfo> = await api.get(
      '/users/sign-in/naver',
      applicationJson
    )
    console.log('loginByNaver')
  } catch (error) {
    console.log(error)
    openAlert(t('signInView.failedToConnect'))
  } finally {
    setTimeout(() => {
      offLoading()
    }, 2000)
  }
}

onMounted(async () => {
  if (localStorage.getItem('accessToken')) {
    await getCoordinate()
    const lat = localStorage.getItem('latitude')
    const lon = localStorage.getItem('longitude')
    if (lat && lon) {
      const response: AxiosResponse<IApiUserInfo> = await getUserInfo(
        parseFloat(lat ? lat : '0'),
        parseFloat(lon ? lon : '0')
      )
      if (response.status === 200 || response.status === 201) {
        setToken(response.data.data)
        useUserInfoStore().setUserInfo(response.data.data)
      } else {
        localStorage.removeItem('accessToken')
      }
    }
    router.push({ name: 'Home' })
  }
})
</script>
