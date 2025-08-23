import { onUnmounted, ref } from 'vue';

/**
 * 모달 관련 공통 유틸리티 함수들
 */
export function useModal() {
	const isModalOpen = ref(false);

	/**
	 * 모달 열 때 body 비활성화
	 */
	const openModal = (): void => {
		document.body.classList.add('inactive');
		isModalOpen.value = true;
	};

	/**
	 * 모달 닫을 때 body 활성화
	 */
	const closeModal = (): void => {
		document.body.classList.remove('inactive');
		isModalOpen.value = false;
	};

	/**
	 * try-catch와 함께 안전하게 모달을 여는 함수
	 */
	const safeOpenModal = async (asyncAction?: () => Promise<void>): Promise<void> => {
		try {
			openModal();
			if (asyncAction) {
				await asyncAction();
			}
		} catch (error) {
			closeModal();
			throw error;
		}
	};

	/**
	 * try-catch와 함께 안전하게 모달을 닫는 함수
	 */
	const safeCloseModal = async (asyncAction?: () => Promise<void>): Promise<void> => {
		try {
			if (asyncAction) {
				await asyncAction();
			}
		} finally {
			closeModal();
		}
	};

	/**
	 * 컴포넌트가 언마운트될 때 자동으로 모달 정리
	 */
	onUnmounted(() => {
		if (isModalOpen.value) {
			closeModal();
		}
	});

	return {
		openModal,
		closeModal,
		safeOpenModal,
		safeCloseModal,
		isModalOpen,
	};
}