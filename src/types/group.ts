export type GroupMemberRole = "OWNER" | "MEMBER";
export type MemberStatus = "ACTIVE" | "LEFT" | "KICKED";
export type GroupStatus = "ACTIVE" | "DELETED";

export interface PrivateGroupData {
  id: number;
  name: string;
  groupImageUrl?: string | null;
  groupImageObjectKey?: string | null;
  maxMembers: number;
  status: GroupStatus;
}

export interface GroupMemberSummary {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  role: GroupMemberRole;
  status: MemberStatus;
  isMe: boolean;
}

export interface UpdateGroupPayload {
  name: string;
  groupImageUrl?: string | null;
}

export const MOCK_GROUP_DATA: PrivateGroupData = {
  id: 10,
  name: "연인",
  groupImageUrl: "/src/asset/home/profile.svg",
  groupImageObjectKey: null,
  maxMembers: 10,
  status: "ACTIVE",
};

export const MOCK_MEMBER_LIST: GroupMemberSummary[] = [
  {
    id: 1,
    userId: 101,
    nickname: "홍길동",
    profileImageUrl: "/src/asset/home/profile.svg",
    role: "OWNER",
    status: "ACTIVE",
    isMe: true,
  },
  {
    id: 2,
    userId: 102,
    nickname: "애인",
    profileImageUrl: "/src/asset/home/profile.svg",
    role: "MEMBER",
    status: "ACTIVE",
    isMe: false,
  },
];
