const timeCalculation = localTime => {
	// LocalDateTime 문자열을 JavaScript Date 객체로 변환
	const postDate = new Date(localTime);
	const now = new Date();
	const diff = now.getTime() - postDate.getTime();

	// 시간 차이를 분 단위로 변환
	const diffMinutes = Math.floor(diff / (1000 * 60));

	if (diffMinutes < 10) {
		return '방금 전';
	} else if (diffMinutes < 60) {
		return `${Math.ceil(diffMinutes / 10) * 10}분 전`;
	}

	// 시간 차이를 시간 단위로 변환
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}시간 전`;
	}

	// 하루 이상 차이 나는 경우 날짜 포맷으로 반환
	return postDate.toLocaleString('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

export { timeCalculation, modalOpenClass, modalCloseClass };
