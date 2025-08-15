import axios from 'axios';
import type { 
	IChatRoom, 
	IChatMessage, 
	IApiChatRoomList, 
	IApiChatMessageList,
	IApiChatRoom,
	IApiChatMessage
} from '../types/index';

// 채팅 전용 API 클라이언트 (포트 8081)
const chatApi = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL?.replace(':8080', ':8081') || 'http://localhost:8081',
	withCredentials: true,
});

// 채팅 API용 요청 인터셉터
chatApi.interceptors.request.use(
	async (config) => {
		const token = localStorage.getItem('accessToken');
		if (token && config.headers) {
			config.headers['Authorization'] = `Bearer ${token}`;
			if (!(config.data instanceof FormData)) {
				config.headers['Content-Type'] = 'application/json';
			}
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

export class ChatService {
	
	// 국가별 채팅방 목록 가져오기
	static async getChatRoomsByCountry(countryId: string, token: string): Promise<IChatRoom[]> {
		const response = await chatApi.get<IChatRoom[]>(
			`/api/v1/chat/rooms/country/${countryId}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		// 백엔드가 직접 배열을 반환하므로 response.data를 사용
		console.log('Country chat rooms response:', response.data);
		return response.data;
	}

	// 사용자 참여 채팅방 목록 가져오기  
	static async getUserChatRooms(userId: string, token: string): Promise<IChatRoom[]> {
		const response = await chatApi.get<IChatRoom[]>(
			`/api/v1/chat/rooms/user/${userId}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		// 백엔드가 직접 배열을 반환하므로 response.data를 사용
		console.log('User chat rooms response:', response.data);
		return response.data;
	}

	// 채팅방 생성
	static async createChatRoom(name: string, countryId: string, createdBy: string, token: string): Promise<IChatRoom> {
		console.log('Creating chat room with:', { name, countryId, createdBy });
		
		const response = await chatApi.post<IChatRoom>(
			'/api/v1/chat/rooms',
			{ name, countryId, createdBy },
			{
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		
		console.log('Create chat room response:', response.data);
		// 백엔드가 직접 객체를 반환하므로 response.data를 사용
		return response.data;
	}

	// 특정 채팅방 정보 가져오기
	static async getChatRoom(chatRoomId: string, token: string): Promise<IChatRoom | null> {
		try {
			const response = await chatApi.get<IChatRoom>(
				`/api/v1/chat/rooms/${chatRoomId}`,
				{
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);
			console.log('Get chat room response:', response.data);
			return response.data;
		} catch (error) {
			return null;
		}
	}

	// 채팅 내역 가져오기 (페이징)
	static async getChatHistory(chatRoomId: string, page: number = 0, size: number = 50, token: string): Promise<IChatMessage[]> {
		const response = await chatApi.get<IChatMessage[]>(
			`/api/v1/chat/rooms/${chatRoomId}/messages?page=${page}&size=${size}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		console.log('Chat history response:', response.data);
		return response.data;
	}

	// 최근 메시지 가져오기
	static async getRecentMessages(chatRoomId: string, token: string): Promise<IChatMessage[]> {
		const response = await chatApi.get<IChatMessage[]>(
			`/api/v1/chat/rooms/${chatRoomId}/messages/recent`,
			{
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		console.log('Recent messages response:', response.data);
		return response.data;
	}

	// 메시지 삭제
	static async deleteMessage(messageId: string, token: string): Promise<IChatMessage | null> {
		try {
			const response = await chatApi.delete<IChatMessage>(
				`/api/v1/chat/messages/${messageId}`,
				{
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);
			console.log('Delete message response:', response.data);
			return response.data;
		} catch (error) {
			return null;
		}
	}
}