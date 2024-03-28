const timeCalculation = localTime => {
	const postDate = new Date(localTime);
	const now = new Date();
	const diff = now.getTime() - postDate.getTime();

	const diffMinutes = Math.floor(diff / (1000 * 60));
	if (diffMinutes < 10) {
		return '방금 전';
	} else if (diffMinutes < 60) {
		return `${Math.ceil(diffMinutes / 10) * 10}분 전`;
	}

	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}시간 전`;
	}

	const diffDays = Math.floor(diffHours / 24);
	if (diffDays === 1) {
		return '하루 전'; // '1일 전'은 '하루 전'으로..
	} else if (diffDays < 30) {
		return `${diffDays}일 전`;
	}

	const diffMonths = Math.floor(diffDays / 30);
	if (diffMonths < 12) {
		return `${diffMonths}개월 전`;
	}

	const diffYears = Math.floor(diffDays / 365);
	return `${diffYears}년 전`;
};

export { timeCalculation };
