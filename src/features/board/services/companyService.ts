import api from '@/core/api';

export const postCompanyInfo = async (param: any) => {
	try {
		const userId = localStorage.getItem('userId');
		const response = await api.post(`/api/v1/companies/users/${userId}`, param);
		return { status: response.status };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};

export const getMyCompanyInfo = async () => {
	try {
		const userId = localStorage.getItem('userId');
		const response = await api.get(`/api/v1/companies/users/${userId}`);
		return { status: response.status, data: response.data };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};
