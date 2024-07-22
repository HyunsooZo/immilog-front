import api from '@/api/index.ts'

export const postCompanyInfo = async (param: any) => {
  try {
    const response = await api.post('/companies', param)
    return { status: response.status }
  } catch (error) {
    console.error(error)
    return { status: 'error', error }
  }
}
