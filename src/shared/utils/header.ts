const applicationJson = {
	headers: {
		'Content-Type': 'application/json',
	},
};
const applicationJsonWithToken = (accessToken: string | null | undefined) => ({
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${accessToken ? accessToken.toString() : ''}`,
	},
});

const multipartFormData = {
	headers: {
		// Content-Type을 명시적으로 설정하지 않음 - 브라우저가 자동으로 boundary 설정
	},
};

const multipartFormDataWithToken = (
	accessToken: string | null | undefined,
) => ({
	headers: {
		// Content-Type을 명시적으로 설정하지 않음 - 브라우저가 자동으로 boundary 설정
		Authorization: `Bearer ${accessToken ? accessToken.toString() : ''}`,
	},
});

const webSocketURL = 'https://api.ko-meet-back.com';

export {
	applicationJson,
	applicationJsonWithToken,
	multipartFormData,
	multipartFormDataWithToken,
	webSocketURL,
};
