import api from '@/core/api/index';

export const postCompanyInfo = async (param: any) => {
	try {
		const userSeq = localStorage.getItem('userSeq');
		const response = await api.post(
			`/api/v1/companies/users/${userSeq}`,
			param,
		);
		return { status: response.status };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};

export const getMyCompanyInfo = async () => {
	try {
		const userSeq = localStorage.getItem('userSeq');
		const response = await api.get(`/api/v1/companies/users/${userSeq}`);
		return { status: response.status, data: response.data };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};
