/**
 * 모달 관련 공통 유틸리티 함수들
 */
export function useModal() {
	/**
	 * 모달 열 때 body 비활성화
	 */
	const openModal = (): void => {
		document.body.classList.add('inactive');
	};

	/**
	 * 모달 닫을 때 body 활성화
	 */
	const closeModal = (): void => {
		document.body.classList.remove('inactive');
	};

	return {
		openModal,
		closeModal,
	};
}