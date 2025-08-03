import type { IUser } from '@/features/auth/types';
import type { IApiResponse, IPagination } from '@/shared/types/common';

// 채팅 인터페이스
export interface IChat {
	chatId: string;
	sender: IUser;
	recipient: IUser;
	content: string;
	attachments: string[];
	chatRoomId: string;
	isRead: boolean;
	createdAt: string;
}

// 채팅방 인터페이스
export interface IChatRoom {
	chatRoomId: string;
	sender: IUser;
	recipient: IUser;
	lastChat: string;
	unreadCountForSender: number;
	unreadCountForRecipient: number;
	lastChatTime: string;
}

// API 응답 타입들
export interface IApiChatRoom extends IApiResponse {
	data: IPagination<IChatRoom>;
}

export interface IApiChatStart extends IApiResponse {
	data: IPagination<IChatRoom>;
}

export interface IApiChatRoomList extends IApiResponse {
	data: IChatRoom[];
}

export interface IApiChat extends IApiResponse {
	data: IPagination<IChat>;
}
