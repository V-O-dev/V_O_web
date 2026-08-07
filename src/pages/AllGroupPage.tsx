import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubPageHeader } from "@/components/common/SubHeader";
import "./AllGroupPage.css";

import defaultProfile from "@/assets/home/profile.svg";

export interface GroupMember {
  id: number;
  profileImageUrl?: string;
}

export interface GroupItem {
  id: number;
  name: string;
  category: "가족" | "연인" | "친구";
  groupImageUrl: string;
  members: GroupMember[];
}

const MOCK_GROUPS: GroupItem[] = [
  {
    id: 1,
    name: "우리 가족",
    category: "가족",
    groupImageUrl: defaultProfile,
    members: [
      { id: 101, profileImageUrl: defaultProfile },
      { id: 102, profileImageUrl: defaultProfile },
      { id: 103, profileImageUrl: defaultProfile },
      { id: 104, profileImageUrl: defaultProfile },
    ],
  },
  {
    id: 2,
    name: "연인이와의 기록",
    category: "연인",
    groupImageUrl: defaultProfile,
    members: [
      { id: 101, profileImageUrl: defaultProfile },
      { id: 102, profileImageUrl: defaultProfile },
    ],
  },
  {
    id: 3,
    name: "찐친들",
    category: "친구",
    groupImageUrl: defaultProfile,
    members: [
      { id: 101, profileImageUrl: defaultProfile },
      { id: 102, profileImageUrl: defaultProfile },
      { id: 103, profileImageUrl: defaultProfile },
      { id: 104, profileImageUrl: defaultProfile },
    ],
  },
  {
    id: 4,
    name: "동아리 사람들",
    category: "친구",
    groupImageUrl: defaultProfile,
    members: [
      { id: 101, profileImageUrl: defaultProfile },
      { id: 102, profileImageUrl: defaultProfile },
      { id: 103, profileImageUrl: defaultProfile },
      { id: 104, profileImageUrl: defaultProfile },
    ],
  },
];

export default function GroupPage() {
  const navigate = useNavigate();
  const [groups] = useState<GroupItem[]>(MOCK_GROUPS);

  const handleCreateGroup = () => {
    navigate("/group/create");
  };

  const handleGroupClick = (groupId: number) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="group-app-wrapper">
      <div className="group-phone-screen">
        <SubPageHeader
          title="그룹 관리"
          leftType="back"
          rightText="+ 만들기"
          onRightClick={handleCreateGroup}
        />

        <main className="group-main-content">
          <h2 className="group-section-title">내 그룹</h2>

          <ul className="group-list">
            {groups.map((group) => (
              <li
                key={group.id}
                className="group-item"
                onClick={() => handleGroupClick(group.id)}
              >
                <div className="group-image-wrapper">
                  <img
                    src={group.groupImageUrl || defaultProfile}
                    alt={group.name}
                    className="group-main-img"
                  />
                </div>

                <div className="group-info">
                  <div className="group-title-row">
                    <span className="group-name">{group.name}</span>
                    <span className="group-badge">{group.category}</span>
                  </div>

                  <div className="group-members-row">
                    <div className="group-avatar-stack">
                      {group.members.slice(0, 4).map((member, idx) => (
                        <img
                          key={member.id || idx}
                          src={defaultProfile}
                          alt="멤버 프로필"
                          className="group-avatar-mini"
                          style={{ zIndex: 10 - idx }}
                        />
                      ))}
                    </div>
                    <span className="group-member-count">
                      {group.members.length}명
                    </span>
                  </div>
                </div>

                <span className="group-arrow">›</span>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
