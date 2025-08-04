import type { IUser } from '@/features/auth/types';
import type { IApiResponse, IPagination } from '@/shared/types/common';

// 알림 인터페이스
export interface INotification {
	notificationId: string;
	user: IUser;
	type: string;
	title: string;
	content: string;
	isRead: boolean;
	relatedId: string;
	createdAt: string;
}

// API 응답 타입들
export interface IApiNotifications extends IApiResponse {
	data: IPagination<INotification>;
}

export interface IApiUnreadNotification extends IApiResponse {
	data: boolean;
}

// 알림 상태 인터페이스
export interface INotificationState {
	isRead: boolean;
	count: number;
	notifications?: INotification[];
}
