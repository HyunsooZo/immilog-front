import { useChatUnreadStore } from '@/features/chat/stores/chatUnread';

interface UnreadCountUpdateEvent {
	type: 'UNREAD_COUNT_UPDATE';
	chatRoomId: string;
	unreadCount: number;
	totalUnreadCount: number;
}

type NotificationMessage = UnreadCountUpdateEvent;

export class GlobalWebSocketService {
	private webSocket: WebSocket | null = null;
	private isConnected: boolean = false;
	private userId: string = '';
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 2000; // 2초
	private chatUnreadStore = useChatUnreadStore();

	// WebSocket 연결
	connect(userId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.isConnected && this.userId === userId) {
				resolve();
				return;
			}

			this.userId = userId;

			// 글로벌 알림 WebSocket은 8081 포트 사용
			const baseUrl =
				import.meta.env.VITE_APP_API_URL?.replace('http', 'ws').replace(
					':8080',
					':8081',
				) || 'ws://localhost:8081';
			const wsUrl = `${baseUrl}/ws/user/${userId}/notifications`;

			console.log('Connecting to global WebSocket:', wsUrl);
			this.webSocket = new WebSocket(wsUrl);

			this.webSocket.onopen = () => {
				this.isConnected = true;
				this.reconnectAttempts = 0;
				console.log(`Global WebSocket connected for user: ${userId}`);
				resolve();
			};

			this.webSocket.onmessage = event => {
				try {
					console.log('Global WebSocket message received:', event.data);
					const message: NotificationMessage = JSON.parse(event.data);
					this.handleMessage(message);
				} catch (error) {
					console.error(
						'Error parsing global WebSocket message:',
						error,
						'Raw data:',
						event.data,
					);
				}
			};

			this.webSocket.onclose = event => {
				this.isConnected = false;
				console.log(
					'Global WebSocket connection closed:',
					event.code,
					event.reason,
				);

				// 자동 재연결 시도
				if (
					!event.wasClean &&
					this.reconnectAttempts < this.maxReconnectAttempts
				) {
					setTimeout(() => {
						this.reconnectAttempts++;
						console.log(
							`Global WebSocket reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
						);
						this.connect(userId);
					}, this.reconnectDelay * this.reconnectAttempts);
				} else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
					console.error('Global WebSocket max reconnection attempts reached');
				}
			};

			this.webSocket.onerror = error => {
				console.error('Global WebSocket error:', error);
				reject(error);
			};
		});
	}

	// 메시지 처리
	private handleMessage(message: NotificationMessage): void {
		switch (message.type) {
			case 'UNREAD_COUNT_UPDATE':
				console.log(
					`Updating unread count for room ${message.chatRoomId}: ${message.unreadCount}`,
				);

				// Store에 안읽은 수 업데이트
				this.chatUnreadStore.setUnreadCount(
					message.chatRoomId,
					message.unreadCount,
				);

				console.log(
					`Total unread count updated: ${this.chatUnreadStore.getTotalUnreadCount}`,
				);
				break;

			default:
				console.warn('Unknown global WebSocket message type:', message);
		}
	}

	// WebSocket 연결 해제
	disconnect(): void {
		if (this.webSocket) {
			console.log('Disconnecting global WebSocket');
			this.webSocket.close();
			this.webSocket = null;
			this.isConnected = false;
			this.userId = '';
			this.reconnectAttempts = 0;
		}
	}

	// 연결 상태 확인
	isConnectedState(): boolean {
		return this.isConnected;
	}

	// 현재 연결된 사용자 ID
	getCurrentUserId(): string {
		return this.userId;
	}
}
