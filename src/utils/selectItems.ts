import type { ISelectItem } from '@/types/interface.ts'

//home, board
const categoryList: ISelectItem[] = [
  { name: 'selectItems.allCategories', code: 'ALL' },
  { name: 'selectItems.workingHoliday', code: 'WORKING_HOLIDAY' },
  { name: 'selectItems.blueCard', code: 'GREEN_CARD' },
  { name: 'selectItems.communication', code: 'COMMUNICATION' },
  { name: 'selectItems.qNA', code: 'QNA' }
]

const sortingList: ISelectItem[] = [
  { name: 'selectItems.sortByRecent', code: 'CREATED_DATE' },
  { name: 'selectItems.sortByLike', code: 'LIKE_COUNT' },
  { name: 'selectItems.sortByView', code: 'VIEW_COUNT' },
  { name: 'selectItems.sortByComment', code: 'COMMENT_COUNT' }
]

const regions: ISelectItem[] = [
  { name: 'country.all', code: 'ALL' },
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
  { name: 'country.ect', code: 'ETC' }
]

// job board
const categoryList2: ISelectItem[] = [
  { name: 'category2.all', code: 'ALL' },
  { name: 'category2.jobOpeningsFrequently', code: 'JOB_OPENINGS_FRE' },
  { name: 'category2.jobOpening', code: 'JOB_OPENING' }
]
const sortingList2: ISelectItem[] = [
  { name: 'sorting2.sortByRecent', code: 'CREATED_DATE' },
  { name: 'sorting2.sortByDeadLine', code: 'DEAD_LINE' },
  { name: 'sorting2.sortByView', code: 'VIEW_COUNT' }
]

export { categoryList, sortingList, regions, categoryList2, sortingList2 }
