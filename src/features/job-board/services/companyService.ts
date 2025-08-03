import api from '@/core/api/index';

export const postCompanyInfo = async (param: any) => {
	try {
		const response = await api.post('/companies', param);
		return { status: response.status };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};

export const getMyCompanyInfo = async () => {
	try {
		const response = await api.get(
			`/companies/users/${localStorage.getItem('userSeq')}`,
		);
		return { status: response.status, data: response.data };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};
