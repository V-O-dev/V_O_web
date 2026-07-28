export interface GroupTheme {
  id: number;
  code?: string;
  name: string;
}

export interface PrivateGroupData {
  id: number;
  name: string;
  groupImageUrl: string | null;
  ownerUserId?: number;
  theme?: GroupTheme;
  isAnsweredToday?: boolean;
}

export interface FeedUserSummary {
  id: number;
  nickname: string;
  customName?: string | null;
  profileImageUrl: string | null;
}

export interface VideoFeedItem {
  id: number;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  user: FeedUserSummary;
  group: PrivateGroupData;
  likesCount: number;
  commentsCount: number;
}

export const MOCK_GROUPS: PrivateGroupData[] = [
  {
    id: 1,
    name: "가족",
    groupImageUrl: null,
    ownerUserId: 101,
    theme: { id: 10, name: "가족테마" },
    isAnsweredToday: false,
  },
  {
    id: 2,
    name: "연인",
    groupImageUrl: null,
    ownerUserId: 101,
    theme: { id: 11, name: "연인테마" },
    isAnsweredToday: true,
  },
];

export const MOCK_VIDEOS: VideoFeedItem[] = [
  {
    id: 501,
    videoUrl: null,
    thumbnailUrl: "/src/assets/thumb1.png",
    createdAt: "2시간 전",
    user: {
      id: 201,
      nickname: "홍길동",
      customName: "엄마",
      profileImageUrl: "/src/assets/profile2.png",
    },
    group: MOCK_GROUPS[0],
    likesCount: 3,
    commentsCount: 1,
  },
  {
    id: 502,
    videoUrl: "/src/assets/video2.mp4",
    thumbnailUrl: "/src/assets/thumb2.png",
    createdAt: "2시간 전",
    user: {
      id: 202,
      nickname: "김철수",
      customName: "아빠",
      profileImageUrl: "/src/assets/profile2.png",
    },
    group: MOCK_GROUPS[0],
    likesCount: 5,
    commentsCount: 2,
  },
];
