export interface GroupTheme {
  id: number;
  code?: string;
  name: string;
}

export interface PrivateGroupData {
  groupId: number;
  name: string;
  imageUrl: string;
  themeCode?: string;
  memberCount?: number;
  role?: string;
  isAnsweredToday?: boolean;
  memberProfileImages?: string[];
}

export interface FeedUserSummary {
  id: number;
  nickname: string;
  customName?: string | null;
  profileImageUrl: string | null;
}

export interface VideoFeedItem {
  videoId: number;
  userId: number;
  nickname: string;
  displayName?: string;
  alias?: string;
  groupId?: number;
  memberId?: number;
  isMe?: boolean;
  profileImageUrl: string | null;
  questionId: number;
  questionContent: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationMs: number;
  reactionCount: number;
  reactedByMe: boolean;
  commentCount: number;
  capturedAt: string;
  uploadedAt: string;
  groupName?: string;
  isLocked?: boolean;
}

export interface GroupFeedResponse {
  unlocked: boolean;
  serviceDate: string;
  viewerAnswerStatus: string;
  items: VideoFeedItem[];
}
