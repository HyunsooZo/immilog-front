//home, board
const categoryList = [
	{ name: '전체', code: 'ALL' },
	{ name: '경력', code: 'WORKING_HOLIDAY' },
	{ name: '영주권', code: 'GREEN_CARD' },
	{ name: '소통', code: 'COMMUNICATION' },
	{ name: '질문/답변', code: 'QNA' },
];
const sortingList = [
	{ name: '최신순', code: 'CREATED_DATE' },
	{ name: '좋아요순', code: 'LIKE_COUNT' },
	{ name: '조회순', code: 'VIEW_COUNT' },
	{ name: '댓글순', code: 'COMMENT_COUNT' },
];

const regions = [
	{ name: '전체', code: 'ALL' },
	{ name: '말레이시아', code: 'MALAYSIA' },
	{ name: '싱가포르', code: 'SINGAPORE' },
	{ name: '인도네시아', code: 'INDONESIA' },
	{ name: '베트남', code: 'VIETNAM' },
	{ name: '필리핀', code: 'PHILIPPINES' },
	{ name: '태국', code: 'THAILAND' },
	{ name: '미얀마', code: 'MYANMAR' },
	{ name: '캄보디아', code: 'CAMBODIA' },
	{ name: '라오스', code: 'LAOS' },
	{ name: '브루나이', code: 'BRUNEI' },
	{ name: '동티모르', code: 'EAST_TIMOR' },
	{ name: '중국', code: 'CHINA' },
	{ name: '일본', code: 'JAPAN' },
	{ name: '대한민국', code: 'SOUTH_KOREA' },
	{ name: '오스트레일리아', code: 'AUSTRALIA' },
	{ name: '뉴질랜드', code: 'NEW_ZEALAND' },
	{ name: '괌', code: 'GUAM' },
	{ name: '사이판', code: 'SAI_PAN' },
	{ name: '기타국가', code: 'ETC' },
];

// job board
const categoryList2 = [
	{ name: '전체', code: 'ALL' },
	{ name: '상시채용', code: 'WORKING_HOLIDAY' },
	{ name: '경력 무관', code: 'GREEN_CARD' },
];
const sortingList2 = [
	{ name: '최신순', code: 'CREATED_DATE' },
	{ name: '기간임박순', code: 'LIKE_COUNT' },
	{ name: '조회순', code: 'VIEW_COUNT' },
];

export { categoryList, sortingList, regions, categoryList2, sortingList2 };
