import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SubPageHeader } from "@/components/common/SubHeader";
import "./AllGroupPage.css";

import { PrivateGroupData } from "@/types/home";
import { fetchMyGroups } from "@/apis/api";
import defaultProfile from "@/assets/home/profile.svg";

// themeCode를 화면 표시용 카테고리 이름으로 변환
const getThemeCategoryName = (themeCode?: string) => {
  switch (themeCode) {
    case "FAMILY":
      return "가족";
    case "COUPLE":
      return "연인";
    case "FRIEND":
      return "친구";
    default:
      return "그룹";
  }
};

export default function GroupPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<PrivateGroupData[]>([]);

  // 서버에서 내 그룹 목록 가져오기
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchMyGroups();
        setGroups(data);
      } catch (error) {
        console.error("내 그룹 목록 불러오기 실패:", error);
      }
    };

    loadGroups();
  }, []);

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
                key={group.groupId}
                className="group-item"
                onClick={() => handleGroupClick(group.groupId)}
              >
                <div className="group-image-wrapper">
                  <img
                    src={group.imageUrl || defaultProfile}
                    alt={group.name}
                    className="group-main-img"
                    onError={(e) => {
                      e.currentTarget.src = defaultProfile;
                    }}
                  />
                </div>

                <div className="group-info">
                  <div className="group-title-row">
                    <span className="group-name">{group.name}</span>
                    <span className="group-badge">
                      {getThemeCategoryName(group.themeCode)}
                    </span>
                  </div>

                  <div className="group-members-row">
                    <div className="group-avatar-stack">
                      {Array.from({
                        length: Math.min(group.memberCount || 1, 6),
                      }).map((_, idx) => (
                        <img
                          key={idx}
                          src={defaultProfile}
                          alt="멤버 프로필"
                          className="group-avatar-mini"
                          style={{ zIndex: 10 - idx }}
                        />
                      ))}
                    </div>
                    <span className="group-member-count">
                      {group.memberCount}명
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
