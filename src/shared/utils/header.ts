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
		'Content-Type': 'multipart/form-data',
	},
};

const multipartFormDataWithToken = (
	accessToken: string | null | undefined,
) => ({
	headers: {
		'Content-Type': 'multipart/form-data',
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
