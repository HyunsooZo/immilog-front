import type { IChatMessage } from '../types/index';

export class WebSocketService {
	private webSocket: WebSocket | null = null;
	private isConnected: boolean = false;
	private chatRoomId: string = '';
	private messageCallback: ((message: IChatMessage) => void) | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 3;

	// WebSocket 연결
	connect(
		chatRoomId: string,
		onMessage: (message: IChatMessage) => void,
	): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.isConnected && this.chatRoomId === chatRoomId) {
				resolve();
				return;
			}

			this.chatRoomId = chatRoomId;
			this.messageCallback = onMessage;

			// 채팅 WebSocket은 8081 포트 사용, ws:// 프로토콜
			const baseUrl =
				import.meta.env.VITE_APP_API_URL?.replace('http', 'ws').replace(
					':8080',
					':8081',
				) || 'ws://localhost:8081';
			const wsUrl = `${baseUrl}/ws/chat/${chatRoomId}`;

			this.webSocket = new WebSocket(wsUrl);

			this.webSocket.onopen = () => {
				this.isConnected = true;
				this.reconnectAttempts = 0;
				console.log(`WebSocket connected to room: ${chatRoomId}`);
				resolve();
			};

			this.webSocket.onmessage = event => {
				try {
					const message: IChatMessage = JSON.parse(event.data);
					if (this.messageCallback) {
						this.messageCallback(message);
					}
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
				}
			};

			this.webSocket.onclose = event => {
				this.isConnected = false;
				console.log('WebSocket connection closed:', event.code, event.reason);

				// 자동 재연결 시도
				if (
					!event.wasClean &&
					this.reconnectAttempts < this.maxReconnectAttempts
				) {
					setTimeout(() => {
						this.reconnectAttempts++;
						console.log(
							`WebSocket reconnection attempt ${this.reconnectAttempts}`,
						);
						this.connect(chatRoomId, onMessage);
					}, 2000 * this.reconnectAttempts);
				}
			};

			this.webSocket.onerror = error => {
				console.error('WebSocket error:', error);
				reject(error);
			};
		});
	}

	// WebSocket 연결 해제
	disconnect(): void {
		if (this.webSocket) {
			this.webSocket.close();
			this.webSocket = null;
			this.isConnected = false;
			this.messageCallback = null;
		}
	}

	// 메시지 전송
	sendMessage(senderId: string, senderNickname: string, content: string): void {
		if (!this.isConnected || !this.webSocket) {
			console.error('WebSocket is not connected');
			return;
		}

		const message = {
			type: 'MESSAGE',
			senderId,
			senderNickname,
			content,
		};

		this.webSocket.send(JSON.stringify(message));
	}

	// 채팅방 참여 알림
	joinChatRoom(senderId: string, senderNickname: string): void {
		if (!this.isConnected || !this.webSocket) {
			console.error('WebSocket is not connected');
			return;
		}

		const message = {
			type: 'JOIN',
			senderId,
			senderNickname,
			content: '',
		};

		this.webSocket.send(JSON.stringify(message));
	}

	// 채팅방 퇴장 알림
	leaveChatRoom(senderId: string, senderNickname: string): void {
		if (!this.isConnected || !this.webSocket) {
			console.error('WebSocket is not connected');
			return;
		}

		const message = {
			type: 'LEAVE',
			senderId,
			senderNickname,
			content: '',
		};

		this.webSocket.send(JSON.stringify(message));
	}

	// 연결 상태 확인
	isConnectedState(): boolean {
		return this.isConnected;
	}
}
