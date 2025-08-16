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
	
	// 국가별 채팅방 목록 가져오기 (Flux 스트림)
	static async getChatRoomsByCountry(countryId: string, token: string): Promise<IChatRoom[]> {
		const response = await fetch(
			`${chatApi.defaults.baseURL}/api/v1/chat/rooms/country/${countryId}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const chatRooms = await response.json();
		console.log('Country chat rooms response:', chatRooms);
		return Array.isArray(chatRooms) ? chatRooms : [];
	}

	// 사용자 참여 채팅방 목록 가져오기 (Flux 스트림)
	static async getUserChatRooms(userId: string, token: string): Promise<IChatRoom[]> {
		const response = await fetch(
			`${chatApi.defaults.baseURL}/api/v1/chat/rooms/user/${userId}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const chatRooms = await response.json();
		console.log('User chat rooms response:', chatRooms);
		return Array.isArray(chatRooms) ? chatRooms : [];
	}

	// 채팅방 생성
	static async createChatRoom(name: string, countryId: string, createdBy: string, token: string): Promise<IChatRoom> {
		console.log('Creating chat room with:', { name, countryId, createdBy });
		
		const response = await fetch(
			`${chatApi.defaults.baseURL}/api/v1/chat/rooms`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, countryId, createdBy })
			}
		);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const result = await response.json();
		console.log('Create chat room response:', result);
		return result;
	}

	// 특정 채팅방 정보 가져오기
	static async getChatRoom(chatRoomId: string, token: string): Promise<IChatRoom | null> {
		try {
			const response = await fetch(
				`${chatApi.defaults.baseURL}/api/v1/chat/rooms/${chatRoomId}`,
				{
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);
			
			if (!response.ok) {
				return null;
			}
			
			const result = await response.json();
			console.log('Get chat room response:', result);
			return result;
		} catch (error) {
			console.error('Error getting chat room:', error);
			return null;
		}
	}

	// 채팅방 참여
	static async joinChatRoom(chatRoomId: string, userId: string, token: string): Promise<IChatRoom | null> {
		try {
			const response = await fetch(
				`${chatApi.defaults.baseURL}/api/v1/chat/rooms/${chatRoomId}/join?userId=${userId}`,
				{
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);
			
			if (!response.ok) {
				return null;
			}
			
			const result = await response.json();
			console.log('Join chat room response:', result);
			return result;
		} catch (error) {
			console.error('Error joining chat room:', error);
			return null;
		}
	}

	// 채팅 내역 가져오기 (페이징)
	static async getChatHistory(chatRoomId: string, page: number = 0, size: number = 50, token: string): Promise<IChatMessage[]> {
		const response = await fetch(
			`${chatApi.defaults.baseURL}/api/v1/chat/rooms/${chatRoomId}/messages?page=${page}&size=${size}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const messages = await response.json();
		console.log('Chat history response:', messages);
		return Array.isArray(messages) ? messages : [];
	}

	// 최근 메시지 가져오기
	static async getRecentMessages(chatRoomId: string, token: string): Promise<IChatMessage[]> {
		const response = await fetch(
			`${chatApi.defaults.baseURL}/api/v1/chat/rooms/${chatRoomId}/messages/recent`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const messages = await response.json();
		console.log('Recent messages response:', messages);
		return Array.isArray(messages) ? messages : [];
	}

	// 메시지 삭제
	static async deleteMessage(messageId: string, token: string): Promise<IChatMessage | null> {
		try {
			const response = await fetch(
				`${chatApi.defaults.baseURL}/api/v1/chat/messages/${messageId}`,
				{
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);
			
			if (!response.ok) {
				return null;
			}
			
			const result = await response.json();
			console.log('Delete message response:', result);
			return result;
		} catch (error) {
			console.error('Error deleting message:', error);
			return null;
		}
	}
}