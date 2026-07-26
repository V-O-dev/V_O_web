import { useState, useEffect, useRef } from "react";
import "./ProfilePage.css";
import { SubPageHeader } from "@/components/common/SubHeader";
import {
  UserProfileData,
  UpdateUserProfilePayload,
  MOCK_USER_PROFILE,
} from "@/types/user";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setProfile(MOCK_USER_PROFILE);
    setNameInput(MOCK_USER_PROFILE.nickname);
  }, []);

  const handleToggleNotification = (
    key: "dailyQuestionNotificationEnabled" | "interactionNotificationEnabled"
  ) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [key]: !profile[key],
    });
  };

  const handleSaveProfile = () => {
    if (!profile) return;
    const updatePayload: UpdateUserProfilePayload = {
      nickname: nameInput,
      dailyQuestionNotificationEnabled:
        profile.dailyQuestionNotificationEnabled,
      interactionNotificationEnabled: profile.interactionNotificationEnabled,
    };
    console.log("백엔드로 보낼 데이터 수집 완료:", updatePayload);
    alert(`서버 전송 테스트 성공!\n이름: ${updatePayload.nickname}`);
  };

  if (!profile) {
    return <div className="profile-loading">프로필을 불러오는 중입니다...</div>;
  }

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const previewUrl = URL.createObjectURL(file);

    setProfile({
      ...profile,
      profileImageUrl: previewUrl,
    });
  };

  return (
    <div className="profile-app-wrapper">
      <div className="profile-phone-screen">
        <SubPageHeader
          title="프로필 설정"
          leftType="back"
          onSave={handleSaveProfile}
        />

        <main className="profile-main-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar-main">
              <img
                src={
                  profile.profileImageUrl || "src/asset/profile/pencil_icon.svg"
                }
                alt="프로필"
                className="profile-avatar-img"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                className="profile-camera-btn"
                onClick={handleCameraClick}
              >
                <img
                  src="src/asset/profile/camera_button.svg"
                  alt="카메라"
                  style={{ width: 19, height: 17 }}
                />
              </button>
            </div>

            <div className="profile-name-wrapper">
              {isEditingName ? (
                <input
                  type="text"
                  className="profile-name-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  autoFocus
                />
              ) : (
                <>
                  <span className="profile-name-text">{nameInput}</span>
                  <button
                    className="profile-edit-name-btn"
                    onClick={() => setIsEditingName(true)}
                  >
                    <img
                      src="src/asset/profile/pencil_icon.svg"
                      alt="편집"
                      style={{ width: 11, height: 11 }}
                    />
                  </button>
                </>
              )}
            </div>
            <p className="profile-sub-text">당신을 부를 이름을 적어주세요</p>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">서비스 알림 설정</h3>
            <div className="profile-card">
              <div className="profile-row">
                <div className="profile-row-left">
                  <div className="profile-icon-bg bg-purple">
                    <img
                      src="src/asset/profile/star_icon.svg"
                      alt="스타"
                      className="profile-row-icon-img"
                    />
                  </div>
                  <div className="profile-row-text">
                    <h4>오늘의 질문 알림</h4>
                    <p>매일 새로운 질문이 배달되면 알려줄게요</p>
                  </div>
                </div>
                <label className="profile-switch">
                  <input
                    type="checkbox"
                    checked={profile.dailyQuestionNotificationEnabled}
                    onChange={() =>
                      handleToggleNotification(
                        "dailyQuestionNotificationEnabled"
                      )
                    }
                  />
                  <span className="profile-slider"></span>
                </label>
              </div>

              <div className="profile-row border-top">
                <div className="profile-row-left">
                  <div className="profile-icon-bg bg-pink">
                    <img
                      src="src/asset/profile/lineheart_icon.svg"
                      alt="하트"
                      className="profile-row-icon-img"
                    />
                  </div>
                  <div className="profile-row-text">
                    <h4>댓글 및 좋아요 알림</h4>
                    <p>그룹원이 남긴 리액션 알림을 받습니다</p>
                  </div>
                </div>
                <label className="profile-switch">
                  <input
                    type="checkbox"
                    checked={profile.interactionNotificationEnabled}
                    onChange={() =>
                      handleToggleNotification("interactionNotificationEnabled")
                    }
                  />
                  <span className="profile-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-card danger-card">
              <button
                className="profile-row-btn"
                onClick={() => alert("로그아웃 되었습니다.")}
              >
                <div className="profile-row-left">
                  <div className="profile-icon-bg bg-red">
                    <img
                      src="src/asset/profile/exit_icon.svg"
                      alt="로그아웃"
                      className="profile-row-icon-img"
                    />
                  </div>
                  <div className="profile-row-text">
                    <h4 className="text-danger">로그아웃</h4>
                    <p>계정에서 로그아웃 합니다</p>
                  </div>
                </div>
                <span className="profile-arrow">〉</span>
              </button>

              <button
                className="profile-row-btn border-top"
                onClick={() => alert("탈퇴 처리되었습니다.")}
              >
                <div className="profile-row-left">
                  <div className="profile-icon-bg bg-red">
                    <img
                      src="src/asset/profile/remove_icon.svg"
                      alt="탈퇴"
                      className="profile-row-icon-img"
                    />
                  </div>
                  <div className="profile-row-text">
                    <h4 className="text-danger">회원 탈퇴</h4>
                    <p>계정과 모든 데이터가 삭제됩니다.</p>
                  </div>
                </div>
                <span className="profile-arrow">〉</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
