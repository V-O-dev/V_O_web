export type NotificationType = "COMMENT" | "REACTION" | "DAILY_QUESTION";

export interface AppNotification {
  notificationId: number;
  type: NotificationType;
  content: string;
  groupName: string;
  relatedVideoId?: number | null;
  isRead: boolean;
  createdAt: string; // ISO 8601 형식
}

export interface NotificationListResponse {
  notifications: AppNotification[];
  hasNext: boolean;
}
