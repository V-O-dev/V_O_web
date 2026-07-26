export type NotificationType = "COMMENT" | "REACTION" | "DAILY_QUESTION";

export interface NotificationActor {
  id: number;
  nickname: string;
}

export interface NotificationGroup {
  id: number;
  name: string;
}

export interface NotificationVideo {
  id: number;
}

export interface AppNotification {
  id: number;
  notificationType: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  readAt: string | null;
  actor: NotificationActor;
  group: NotificationGroup;
  video: NotificationVideo | null;
  createdAt: string;
}

// 테스트용 데이터
const nowMs = Date.now();

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    notificationType: "COMMENT",
    title: "COMMENT_ALERT",
    body: "허허허 오늘 하루 정말 좋아 보이는구나 😄",
    isRead: false,
    readAt: null,
    actor: { id: 101, nickname: "아빠" },
    group: { id: 1, name: "가족 그룹" },
    video: { id: 501 },
    createdAt: new Date(nowMs - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 2,
    notificationType: "COMMENT",
    title: "COMMENT_ALERT",
    body: "ㅋㅋㅋ",
    isRead: false,
    readAt: null,
    actor: { id: 102, nickname: "남동생" },
    group: { id: 1, name: "가족 그룹" },
    video: { id: 501 },
    createdAt: new Date(nowMs - 1000 * 60 * 24).toISOString(),
  },
  {
    id: 3,
    notificationType: "REACTION",
    title: "REACTION_ALERT",
    body: "",
    isRead: true,
    readAt: new Date().toISOString(),
    actor: { id: 103, nickname: "애인" },
    group: { id: 2, name: "연인 그룹" },
    video: { id: 502 },
    createdAt: new Date(nowMs - 1000 * 60 * 60 * 25).toISOString(),
  },
  {
    id: 4,
    notificationType: "COMMENT",
    title: "COMMENT_ALERT",
    body: "딸 예쁘다~~",
    isRead: false,
    readAt: null,
    actor: { id: 104, nickname: "엄마" },
    group: { id: 1, name: "가족 그룹" },
    video: { id: 503 },
    createdAt: new Date(nowMs - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];
