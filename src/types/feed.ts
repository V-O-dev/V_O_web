export interface VideoDetailData {
  videoId: number;
  groupId: number;
  questionId: number;
  videoUrl: string;
  thumbnailUrl?: string | null;
  durationMs?: number;
  uploadedAt: string;

  nickname?: string;
  groupName?: string;
  questionContent?: string;
  profileImageUrl?: string | null;
  reactionCount?: number;
  reactedByMe?: boolean;
  isLiked?: boolean;
  likeCount?: number;
}

export interface CommentWriter {
  userId: number;
  nickname: string;
  profileImageUrl?: string | null;
}

export interface CommentItem {
  commentId: number;
  content: string;
  writer: CommentWriter;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  comments: CommentItem[];
  hasNext: boolean;
}
