// 프로젝트의 국가 코드를 flag-icons의 ISO 3166-1 alpha-2 코드로 매핑
export const countryCodeToFlagCode = (countryCode: string): string => {
	const mapping: { [key: string]: string } = {
		// 특수 국가
		ALL: 'world', // 전체국가는 지구 아이콘 (하지만 실제로는 표시하지 않음)
		ETC: 'etc', // 기타는 깃발 아이콘 🏳️
		
		// 백엔드 API에서 제공하는 모든 국가들 (ISO 3166-1 alpha-2 기준)
		AE: 'ae', // 아랍에미리트
		AF: 'af', // 아프가니스탄  
		AM: 'am', // 아르메니아
		AR: 'ar', // 아르헨티나
		AT: 'at', // 오스트리아
		AU: 'au', // 호주
		AZ: 'az', // 아제르바이잔
		BD: 'bd', // 방글라데시
		BE: 'be', // 벨기에
		BH: 'bh', // 바레인
		BN: 'bn', // 브루나이
		BR: 'br', // 브라질
		BT: 'bt', // 부탄
		CA: 'ca', // 캐나다
		CH: 'ch', // 스위스
		CN: 'cn', // 중국
		CZ: 'cz', // 체코
		DE: 'de', // 독일
		DK: 'dk', // 덴마크
		ES: 'es', // 스페인
		FI: 'fi', // 핀란드
		FR: 'fr', // 프랑스
		GB: 'gb', // 영국
		GE: 'ge', // 조지아
		GR: 'gr', // 그리스
		HU: 'hu', // 헝가리
		ID: 'id', // 인도네시아
		IE: 'ie', // 아일랜드
		IL: 'il', // 이스라엘
		IN: 'in', // 인도
		IQ: 'iq', // 이라크
		IR: 'ir', // 이란
		IT: 'it', // 이탈리아
		JO: 'jo', // 요단
		JP: 'jp', // 일본
		KG: 'kg', // 키르기스스탄
		KH: 'kh', // 캄보디아
		KP: 'kp', // 북한
		KR: 'kr', // 대한민국
		KW: 'kw', // 쿠웨이트
		KZ: 'kz', // 카자흐스탄
		LA: 'la', // 라오스
		LB: 'lb', // 레바논
		LK: 'lk', // 스리랑카
		MM: 'mm', // 미얀마
		MN: 'mn', // 몽골
		MV: 'mv', // 몰디브
		MX: 'mx', // 멕시코
		MY: 'my', // 말레이시아
		NL: 'nl', // 네덜란드
		NO: 'no', // 노르웨이
		NP: 'np', // 네팔
		NZ: 'nz', // 뉴질랜드
		OM: 'om', // 오만
		PH: 'ph', // 필리핀
		PK: 'pk', // 파키스탄
		PL: 'pl', // 폴란드
		PS: 'ps', // 팔레스타인
		PT: 'pt', // 포르투갈
		QA: 'qa', // 카타르
		RU: 'ru', // 러시아
		SA: 'sa', // 사우디아라비아
		SE: 'se', // 스웨덴
		SG: 'sg', // 싱가포르
		SY: 'sy', // 시리아
		TH: 'th', // 태국
		TJ: 'tj', // 타지키스탄
		TL: 'tl', // 동티모르
		TM: 'tm', // 투르크메니스탄
		TR: 'tr', // 터키
		TW: 'tw', // 대만
		US: 'us', // 미국
		UZ: 'uz', // 우즈베키스탄
		VN: 'vn', // 베트남
		YE: 'ye', // 예멘
		
		// 기존 레거시 매핑 (하위 호환성)
		MALAYSIA: 'my',
		SINGAPORE: 'sg',
		INDONESIA: 'id',
		VIETNAM: 'vn',
		PHILIPPINES: 'ph',
		THAILAND: 'th',
		MYANMAR: 'mm',
		CAMBODIA: 'kh',
		LAOS: 'la',
		BRUNEI: 'bn',
		EAST_TIMOR: 'tl',
		CHINA: 'cn',
		JAPAN: 'jp',
		SOUTH_KOREA: 'kr',
		AUSTRALIA: 'au',
		NEW_ZEALAND: 'nz',
		GUAM: 'gu',
		SAI_PAN: 'mp', // Northern Mariana Islands (사이판)
	};

	return mapping[countryCode] || '';
};
