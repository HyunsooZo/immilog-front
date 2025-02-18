import api from '@/api/index.ts';
import axios from 'axios';

// API 기본 URL 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

// Helper functions to get token and userSeq dynamically
const getToken = () => localStorage.getItem('accessToken');
const getUserSeq = () => localStorage.getItem('userSeq');

// 공통 에러 핸들링 함수
const handleError = (error: any) => {
  console.error(error);
  return { status: 'error', error };
};

// 좋아요 API 요청 함수
export const likeApi = async (path: string, seq: number) => {
  const token = getToken();
  if (!token) return { status: 'unauthenticated' };

  try {
    const postType = path === 'job-boards' ? 'JOB_BOARD' : 'POST';
    const response = await api.post(
      `/interaction/posts/${seq}`,
      null,
      {
        params: {
          interactionType: 'LIKE',
          postType,
          userSeq: getUserSeq(),
        },
      }
    );
    return { status: response.status };
  } catch (error) {
    return handleError(error);
  }
};


// view 업데이트 API 요청 함수
export const viewApi = async (seq: any, jobPostFlag: boolean) => {
  try {
    const endpoint = jobPostFlag ? `/job-boards/${seq}/view` : `/posts/${seq}/view`;
    const response = await api.patch(endpoint);
    return { status: response.status };
  } catch (error) {
    return handleError(error);
  }
};

// 북마크된 포스트 조회 API 요청 함수
export const getBookmarkedPostApi = async () => {
  const token = getToken();
  if (!token) return { status: 'unauthenticated' };

  try {
    const response = await api.get(`/bookmarks/post`);
    return { status: response.status, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// 포스트 북마크 API 요청 함수
export const postBookmark = async (seq: any) => {
  const token = getToken();
  if (!token) return { status: 'unauthenticated' };

  try {
    const response = await api.post(`/bookmarks/post/${seq}`);
    return { status: response.status };
  } catch (error) {
    return handleError(error);
  }
};

// 포스트 업로드 API 요청 함수
export const uploadPostApi = async (userSeq: number | null, param: any) => {
  const token = getToken();
  if (!token) return { status: 'unauthenticated' };

  try {
    const response = await api.post(`/posts/users/${userSeq}`, param);
    return { status: response.status, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// 잡보드 업로드 API 요청 함수
export const uploadJobBoardApi = async (param: any) => {
  const token = getToken();
  if (!token) return { status: 'unauthenticated' };

  try {
    const response = await api.post(`/job-boards`, param);
    return { status: response.status, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};
