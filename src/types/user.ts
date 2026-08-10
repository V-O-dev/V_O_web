export interface UserProfileData {
  userId?: number;
  nickname: string;
  profileImageUrl: string | null;
  provider?: string;
  questionNotification: boolean;
  interactionNotification: boolean;
}

export interface NotificationSettingsPayload {
  questionNotification: boolean;
  interactionNotification: boolean;
}
