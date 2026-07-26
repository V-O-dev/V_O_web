export interface UserProfile {
  user: number;
  nickname: string;
  profileImageUrl?: string | null;
  profileImageObjectKey?: string | null;
  onboardingCompletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileData {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  profileImageObjectKey?: string | null;
  dailyQuestionNotificationEnabled: boolean;
  interactionNotificationEnabled: boolean;
}

export interface UpdateUserProfilePayload {
  nickname: string;
  dailyQuestionNotificationEnabled: boolean;
  interactionNotificationEnabled: boolean;
}

export const MOCK_USER_PROFILE: UserProfileData = {
  id: 1,
  nickname: "홍길동",
  profileImageUrl: "/src/assets/home/profile.svg",
  profileImageObjectKey: null,
  dailyQuestionNotificationEnabled: true,
  interactionNotificationEnabled: false,
};
