import { defineStore } from 'pinia';

interface ChatUnreadState {
	// 채팅방별 안읽은 메시지 수 { chatRoomId: unreadCount }
	unreadCounts: Record<string, number>;
	// 총 안읽은 메시지 수
	totalUnreadCount: number;
}

export const useChatUnreadStore = defineStore('chatUnread', {
	state: (): ChatUnreadState => ({
		unreadCounts: {},
		totalUnreadCount: 0,
	}),
	
	getters: {
		// 특정 채팅방의 안읽은 메시지 수 조회
		getUnreadCount: (state) => (chatRoomId: string) => {
			return state.unreadCounts[chatRoomId] || 0;
		},
		
		// 총 안읽은 메시지 수 조회
		getTotalUnreadCount: (state) => state.totalUnreadCount,
	},
	
	actions: {
		// 특정 채팅방의 안읽은 메시지 수 설정
		setUnreadCount(chatRoomId: string, count: number): void {
			const oldCount = this.unreadCounts[chatRoomId] || 0;
			this.unreadCounts[chatRoomId] = Math.max(0, count);
			
			// 총 안읽은 수 업데이트
			this.totalUnreadCount = this.totalUnreadCount - oldCount + this.unreadCounts[chatRoomId];
			this.totalUnreadCount = Math.max(0, this.totalUnreadCount);
		},
		
		// 특정 채팅방의 안읽은 메시지 수 증가
		increaseUnreadCount(chatRoomId: string, increment: number = 1): void {
			const currentCount = this.unreadCounts[chatRoomId] || 0;
			this.setUnreadCount(chatRoomId, currentCount + increment);
		},
		
		// 특정 채팅방의 안읽은 메시지 수 감소
		decreaseUnreadCount(chatRoomId: string, decrement: number = 1): void {
			const currentCount = this.unreadCounts[chatRoomId] || 0;
			this.setUnreadCount(chatRoomId, Math.max(0, currentCount - decrement));
		},
		
		// 특정 채팅방의 모든 메시지를 읽음 처리
		markAllAsRead(chatRoomId: string): void {
			this.setUnreadCount(chatRoomId, 0);
		},
		
		// 모든 채팅방의 안읽은 메시지 수를 한번에 설정
		setAllUnreadCounts(unreadCounts: Record<string, number>): void {
			this.unreadCounts = { ...unreadCounts };
			this.totalUnreadCount = Object.values(unreadCounts).reduce((total, count) => total + count, 0);
		},
		
		// 채팅방 삭제 시 해당 방의 안읽은 수 제거
		removeChatRoom(chatRoomId: string): void {
			const removedCount = this.unreadCounts[chatRoomId] || 0;
			delete this.unreadCounts[chatRoomId];
			this.totalUnreadCount = Math.max(0, this.totalUnreadCount - removedCount);
		},
		
		// 초기화
		reset(): void {
			this.unreadCounts = {};
			this.totalUnreadCount = 0;
		},
	},
});