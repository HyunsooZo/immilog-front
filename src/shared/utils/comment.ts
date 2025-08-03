interface ExtractResult {
	atWord: string | null;
	restText: string;
}

const extractAtWordAndRest = (text: string): ExtractResult => {
	// '@'로 시작하는 단어를 찾는 정규 표현식
	const regex = /@\S+/;
	const match = text.match(regex);

	if (match) {
		// '@'로 시작하는 단어를 찾았다면
		const atWord = match[0].replace('@', ''); // '@'로 시작하는 단어
		const restText = text
			.slice((match.index ? match.index : 0) + atWord.length + 1)
			.trim(); // 나머지 텍스트

		return { atWord, restText };
	} else {
		// '@'로 시작하는 단어가 없다면 원래 문자열을 반환
		return { atWord: null, restText: text };
	}
};

export { extractAtWordAndRest };
