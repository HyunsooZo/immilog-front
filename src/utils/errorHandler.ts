import { IApiErrorResponse } from '@/types/api-interface.ts'
import { AxiosError } from 'axios'

export const handleError = (error: AxiosError<IApiErrorResponse>) => {
  console.log(error)
  const errorMessage = error.response?.data.message
  if (errorMessage === '이메일 형식에 맞게 입력해주세요.') {
    return 'signInView.invalidEmailFormat'
  } else if (errorMessage === '비밀번호는 8자에서 15자여야 합니다.') {
    return 'signInView.passwordLengthError'
  } else if (errorMessage === '비밀번호가 일치하지 않습니다.') {
    return 'signInView.passwordNotMatch'
  } else if (errorMessage === '사용자 상태가 활성화되어 있지 않습니다.') {
    return 'signInView.notAnActiveUser'
  } else {
    return 'signInView.failedToConnect'
  }
}
