/**
 * @typedef {Object} ApiResponse
 * @property {boolean} status
 */
export const ApiResponse = {
	status: false,
};

/**
 * @typedef {Object} ApiLoginResponse
 * @property {boolean} status
 * @property {Object} data
 * @property {string} data.accessToken
 * @property {string} data.refreshToken
 * @property {string} data.email
 * @property {string} data.nickName
 * @property {boolean} data.isLocationMatch
 */
export const ApiLoginResponse = {
	...ApiResponse,
	data: {
		accessToken: '',
		refreshToken: '',
		email: '',
		nickName: '',
		isLocationMatch: false,
	},
};
