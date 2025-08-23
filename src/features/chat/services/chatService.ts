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
		const url = `${chatApi.defaults.baseURL}/api/v1/chat/rooms/user/${userId}`;
		console.log('Fetching user chat rooms from URL:', url);
		console.log('Using userId:', userId);
		
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		
		console.log('getUserChatRooms response status:', response.status);
		
		if (!response.ok) {
			console.error('getUserChatRooms failed:', response.status, response.statusText);
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const chatRooms = await response.json();
		console.log('User chat rooms response:', chatRooms);
		console.log('Response is array:', Array.isArray(chatRooms));
		console.log('Response length:', Array.isArray(chatRooms) ? chatRooms.length : 'N/A');
		
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

	// 기존 개인 채팅방 찾기
	static async findExistingPrivateChatRoom(targetUserId: string, currentUserId: string, token: string): Promise<string | null> {
		try {
			// 내 채팅방 목록에서 해당 사용자와의 개인 채팅방 찾기
			const myRooms = await this.getUserChatRooms(currentUserId, token);
			
			// isPrivateChat이 true이고 participants에 targetUserId가 포함된 채팅방 찾기
			const existingRoom = myRooms.find(room => 
				room.isPrivateChat && 
				room.participants.some(p => p.userId === targetUserId)
			);
			
			return existingRoom ? existingRoom.id : null;
		} catch (error) {
			console.error('Error finding existing private chat room:', error);
			return null;
		}
	}

	// 개인 채팅방 생성 또는 기존 채팅방 반환
	static async createOrFindPrivateChatRoom(targetUserId: string, createdBy: string, token: string): Promise<string | null> {
		try {
			// 먼저 기존 개인 채팅방이 있는지 확인
			const existingRoomId = await this.findExistingPrivateChatRoom(targetUserId, createdBy, token);
			if (existingRoomId) {
				console.log('Found existing private chat room:', existingRoomId);
				return existingRoomId;
			}

			// 기존 채팅방이 없으면 새로 생성
			const response = await fetch(
				`${chatApi.defaults.baseURL}/api/v1/chat/rooms/private?createdBy=${createdBy}`,
				{
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ targetUserId })
				}
			);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const result = await response.json();
			console.log('Create private chat room response:', result);
			
			// 백엔드에서 직접 ChatRoomDto를 반환하므로 result.id 사용
			return result.id || null;
		} catch (error) {
			console.error('Error creating or finding private chat room:', error);
			return null;
		}
	}

	// 기존 createPrivateChatRoom은 deprecated, createOrFindPrivateChatRoom 사용 권장
	static async createPrivateChatRoom(targetUserId: string, createdBy: string, token: string): Promise<string | null> {
		return this.createOrFindPrivateChatRoom(targetUserId, createdBy, token);
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

	// 채팅방의 모든 메시지를 읽음 처리
	static async markAllMessagesAsRead(chatRoomId: string, userId: string, token: string): Promise<void> {
		try {
			const response = await fetch(
				`${chatApi.defaults.baseURL}/api/v1/chat/rooms/${chatRoomId}/read-all?userId=${userId}`,
				{
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error('Error marking all messages as read:', error);
			throw error;
		}
	}

	// 특정 채팅방의 안읽은 메시지 수 조회
	static async getUnreadCount(chatRoomId: string, userId: string, token: string): Promise<number> {
		try {
			const response = await fetch(
				`${chatApi.defaults.baseURL}/api/v1/chat/rooms/${chatRoomId}/unread-count?userId=${userId}`,
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
			
			const result = await response.json();
			return result.unreadCount || 0;
		} catch (error) {
			console.error('Error getting unread count:', error);
			return 0;
		}
	}

	// 사용자의 모든 채팅방 안읽은 메시지 수 조회
	static async getAllUnreadCounts(userId: string, token: string): Promise<{unreadCounts: Record<string, number>, totalUnreadCount: number}> {
		try {
			const response = await fetch(
				`${chatApi.defaults.baseURL}/api/v1/chat/users/${userId}/unread-counts`,
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
			
			const result = await response.json();
			return {
				unreadCounts: result.unreadCounts || {},
				totalUnreadCount: result.totalUnreadCount || 0
			};
		} catch (error) {
			console.error('Error getting all unread counts:', error);
			return { unreadCounts: {}, totalUnreadCount: 0 };
		}
	}
}