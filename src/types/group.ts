export type GroupMemberRole = "OWNER" | "MEMBER";

export interface GroupMemberSummary {
  memberId: number;
  userId: number;
  nickname?: string;
  profileImageUrl?: string | null;
  role: GroupMemberRole;
  joinedAt?: string;
  isMe?: boolean;

  alias?: string | null;
  displayName?: string | null;
}

export interface GroupDetailData {
  groupId: number;
  name: string;
  imageUrl?: string | null;
  themeCode?: string;
  ownerUserId: number;
  notificationStartTime?: string;
  notificationEndTime?: string;
  timezone?: string;
  maxMembers?: number;
  memberCount?: number;
  members: GroupMemberSummary[];
}

export interface UpdateGroupPayload {
  groupName?: string;
  themeCode?: string;
  image?: File;
}
