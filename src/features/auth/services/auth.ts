import { AxiosResponse } from 'axios';
import type { IApiUserInfo } from '@/features/auth/types/index';
import { applicationJsonWithToken } from '@/shared/utils/header';
import api from '@/core/api/index';

let isInProgress = false;
export const fetchUserInfo = async (
	accessToken: string | null | undefined,
	userSeq: string | null | undefined,
) => {
	if (!accessToken || !userSeq) {
		isInProgress = false;
		throw new Error('No access token found.');
	}
	if (!isInProgress) {
		isInProgress = true;
		const latitude = localStorage.getItem('latitude') || '0';
		const longitude = localStorage.getItem('longitude') || '0';
		try {
			const response: AxiosResponse<IApiUserInfo> = await api.get(
				`/api/v1/auth/me?latitude=${latitude}&longitude=${longitude}`,
				applicationJsonWithToken(accessToken),
			);
			if (response.status === 200 && response.data.status === 200) {
				isInProgress = false;
				return response;
			}
		} catch (error) {
			isInProgress = false;
			throw error;
		}
	}
};
