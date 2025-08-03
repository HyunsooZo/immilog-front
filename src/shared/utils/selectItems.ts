import type { ISelectItem } from '@/shared/types/common';

//home, board
const categoryList: ISelectItem[] = [
	{ name: 'selectItems.allCategories', code: 'ALL' },
	{ name: 'selectItems.workingHoliday', code: 'WORKING_HOLIDAY' },
	{ name: 'selectItems.blueCard', code: 'GREEN_CARD' },
	{ name: 'selectItems.communication', code: 'COMMUNICATION' },
	{ name: 'selectItems.qNA', code: 'QNA' },
];

const sortingList: ISelectItem[] = [
	{ name: 'selectItems.sortByRecent', code: 'CREATED_DATE' },
	{ name: 'selectItems.sortByLike', code: 'LIKE_COUNT' },
	{ name: 'selectItems.sortByView', code: 'VIEW_COUNT' },
	{ name: 'selectItems.sortByComment', code: 'COMMENT_COUNT' },
];

const countries: ISelectItem[] = [
	{ name: 'country.malaysia', code: 'MALAYSIA' },
	{ name: 'country.singapore', code: 'SINGAPORE' },
	{ name: 'country.indonesia', code: 'INDONESIA' },
	{ name: 'country.vietnam', code: 'VIETNAM' },
	{ name: 'country.philippines', code: 'PHILIPPINES' },
	{ name: 'country.thailand', code: 'THAILAND' },
	{ name: 'country.myanmar', code: 'MYANMAR' },
	{ name: 'country.cambodia', code: 'CAMBODIA' },
	{ name: 'country.laos', code: 'LAOS' },
	{ name: 'country.brunai', code: 'BRUNEI' },
	{ name: 'country.easttimor', code: 'EAST_TIMOR' },
	{ name: 'country.china', code: 'CHINA' },
	{ name: 'country.japan', code: 'JAPAN' },
	{ name: 'country.korea', code: 'SOUTH_KOREA' },
	{ name: 'country.australia', code: 'AUSTRALIA' },
	{ name: 'country.newZealand', code: 'NEW_ZEALAND' },
	{ name: 'country.guam', code: 'GUAM' },
	{ name: 'country.saipan', code: 'SAI_PAN' },
	{ name: 'country.ect', code: 'ETC' },
];

// job board
const experienceList: ISelectItem[] = [
	{ name: 'experience.all', code: 'ALL' },
	{ name: 'experience.junior', code: 'JUNIOR' },
	{ name: 'experience.junior2', code: 'JUNIOR2' },
	{ name: 'experience.middle', code: 'MIDDLE' },
	{ name: 'experience.senior', code: 'SENIOR' },
	{ name: 'experience.director', code: 'DIRECTOR' },
	{ name: 'experience.executive', code: 'EXECUTIVE' },
];
const sortingList2: ISelectItem[] = [
	{ name: 'sorting2.sortByRecent', code: 'CREATED_DATE' },
	{ name: 'sorting2.sortByDeadLine', code: 'DEAD_LINE' },
	{ name: 'sorting2.sortByView', code: 'VIEW_COUNT' },
];
const industryList: ISelectItem[] = [
	{ name: 'industry.all', code: 'ALL' },
	{ name: 'industry.IT', code: 'IT' },
	{ name: 'industry.marketing', code: 'MARKETING' },
	{ name: 'industry.design', code: 'DESIGN' },
	{ name: 'industry.sales', code: 'SALES' },
	{ name: 'industry.finance', code: 'FINANCE' },
	{ name: 'industry.hr', code: 'HR' },
	{ name: 'industry.service', code: 'SERVICE' },
	{ name: 'industry.architecture', code: 'ARCHITECTURE' },
	{ name: 'industry.etc', code: 'ETC' },
];

export {
	categoryList,
	sortingList,
	sortingList2,
	countries,
	experienceList,
	industryList,
};
