import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/features/user/stores/userInfo';

/**
 * 인증 관련 공통 유틸리티 함수들
 */
export function useAuth() {
	const router = useRouter();
	const userInfo = useUserInfoStore();

	/**
	 * 토큰 존재 여부 확인 후 없으면 로그인 페이지로 리다이렉트
	 */
	const checkIfTokenExists = (): boolean => {
		if (!userInfo.accessToken) {
			router.push('/sign-in');
			return false;
		}
		return true;
	};

	/**
	 * 로컬 스토리지에서 토큰 가져오기 (fallback)
	 */
	const getToken = (): string | null => {
		return userInfo.accessToken || localStorage.getItem('accessToken');
	};

	/**
	 * 현재 사용자 ID 가져오기
	 */
	const getCurrentUserId = (): string => {
		return userInfo.userId || '';
	};

	return {
		checkIfTokenExists,
		getToken,
		getCurrentUserId,
		userInfo,
	};
}