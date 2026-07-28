import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditNicknamePage.css";
import { SubPageHeader } from "@/components/common/SubHeader";
import profileIcon from "@/assets/home/profile.svg";

interface TargetUserProfile {
  userId: number;
  originalName: string;
  customName: string;
  profileImageUrl: string | null;
}

const MOCK_TARGET_USER: TargetUserProfile = {
  userId: 102,
  originalName: "홍길동",
  customName: "엄마",
  profileImageUrl: null,
};

export default function EditNicknamePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [userInfo, setUserInfo] = useState<TargetUserProfile | null>(null);
  const [nicknameInput, setNicknameInput] = useState("");

  useEffect(() => {
    setUserInfo(MOCK_TARGET_USER);
    setNicknameInput(MOCK_TARGET_USER.customName);
  }, [userId]);

  const handleClearInput = () => {
    setNicknameInput("");
  };

  const handleSave = () => {
    if (!userInfo) return;

    const payload = {
      targetUserId: userInfo.userId,
      customName: nicknameInput,
    };

    console.log("백엔드로 보낼 호칭 수정 Payload:", payload);
    alert(`호칭이 '${nicknameInput}'(으)로 변경되었습니다.`);
    navigate(-1);
  };

  if (!userInfo) {
    return <div className="edit-nickname-loading">불러오는 중...</div>;
  }

  return (
    <div className="edit-nickname-wrapper">
      <div className="edit-nickname-phone-screen">
        <SubPageHeader title="이름 편집" leftType="close" onSave={handleSave} />

        <main className="edit-nickname-content">
          <div className="edit-nickname-avatar-section">
            <div className="edit-nickname-avatar-circle">
              <img
                src={userInfo.profileImageUrl || profileIcon}
                alt="프로필"
                className="edit-nickname-avatar-img"
                onError={(e) => {
                  e.currentTarget.src = profileIcon
                }}
              />
            </div>
            <p className="edit-nickname-original-text">
              상대방 설정한 원래 이름은 '{userInfo.originalName}'입니다.
            </p>
          </div>

          <div className="edit-nickname-form-section">
            <label className="edit-nickname-label">
              이 그룹에서 나에게 보일 호칭
            </label>

            <div className="edit-nickname-input-wrapper">
              <input
                type="text"
                className="edit-nickname-input"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="호칭을 입력해주세요"
              />
              {nicknameInput.length > 0 && (
                <button
                  type="button"
                  className="edit-nickname-clear-btn"
                  onClick={handleClearInput}
                >
                  ✕
                </button>
              )}
            </div>

            <p className="edit-nickname-tip-text">
              💡 설정한 호칭은 다른 그룹원에게 공유되지 않으며
              <br />
              오직 본인의 홈 피드 스크린에서만 적용되어 보입니다.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
