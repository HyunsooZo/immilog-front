import type { IApiResponse, IPagination } from '@/shared/types/common';

// 메시지 타입 열거형
export enum MessageType {
	TEXT = 'TEXT',
	SYSTEM_JOIN = 'SYSTEM_JOIN',
	SYSTEM_LEAVE = 'SYSTEM_LEAVE'
}

// 채팅 메시지 인터페이스 (백엔드 ChatMessageDto에 대응)
export interface IChatMessage {
	id: string;
	chatRoomId: string;
	senderId: string;
	senderNickname: string;
	content: string;
	messageType: string;
	sentAt: string;
	isDeleted: boolean;
}

// 최신 메시지 인터페이스 (백엔드 LatestMessageDto에 대응)
export interface ILatestMessage {
	content: string;
	senderNickname: string;
	sentAt: string;
	messageType: string;
}

// 채팅방 인터페이스 (백엔드 ChatRoomDto에 대응)
export interface IChatRoom {
	id: string;
	name: string;
	countryId: string;
	participantIds: string[];
	createdBy: string;
	createdAt: string;
	participantCount: number;
	isActive: boolean;
	latestMessage?: ILatestMessage | null;
}

// WebSocket 메시지 요청을 위한 인터페이스
export interface IChatMessageRequest {
	type: 'MESSAGE' | 'JOIN' | 'LEAVE';
	senderId: string;
	senderNickname: string;
	content: string;
}

// API 응답 타입들
export interface IApiChatRoomList extends IApiResponse {
	data: IChatRoom[];
}

export interface IApiChatMessageList extends IApiResponse {
	data: IChatMessage[];
}

export interface IApiChatRoom extends IApiResponse {
	data: IChatRoom;
}

export interface IApiChatMessage extends IApiResponse {
	data: IChatMessage;
}
