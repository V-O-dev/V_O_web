import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { SubPageHeader } from "@/components/common/SubHeader";
import {
  UserProfileData,
  UpdateUserProfilePayload,
  MOCK_USER_PROFILE,
} from "@/types/user";

import profileIcon from "@/assets/home/profile.svg";
import cameraButton from "@/assets/profile/camera_button.svg";
import pencilIcon from "@/assets/profile/pencil_icon.svg";
import starIcon from "@/assets/profile/star_icon.svg";
import lineheartIcon from "@/assets/profile/lineheart_icon.svg";
import exitIcon from "@/assets/profile/exit_icon.svg";
import removeIcon from "@/assets/profile/remove_icon.svg";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setProfile(MOCK_USER_PROFILE);
    setNameInput(MOCK_USER_PROFILE.nickname);
  }, []);

  const handleToggleNotification = (
    key: "dailyQuestionNotificationEnabled" | "interactionNotificationEnabled"
  ) => {
    if (!profile) return;

    const currentVal = profile[key];

    // 오늘의 질문 알림이 켜진(true) 상태에서 끌 때만 모달 오픈
    if (key === "dailyQuestionNotificationEnabled" && currentVal === true) {
      setShowNotificationModal(true);
    } else {
      setProfile({
        ...profile,
        [key]: !currentVal,
      });
    }
  };

  // 👈 아래 함수 2개 추가
  // 모달 '확인' 클릭 시 실제 알림 꺼짐 처리
  const handleConfirmTurnOff = () => {
    if (!profile) return;
    setProfile({ ...profile, dailyQuestionNotificationEnabled: false });
    setShowNotificationModal(false);
  };

  // 모달 '취소' 클릭 시 모달만 닫기
  const handleCancelTurnOff = () => {
    setShowNotificationModal(false);
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
                src={profile.profileImageUrl || profileIcon}
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
                  src={cameraButton}
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
                      src={pencilIcon}
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
                      src={starIcon}
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
                      src={lineheartIcon}
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
            <div className="profile-card">
              <button
                type="button"
                className="profile-row-btn"
                onClick={() => navigate("/Allgroup")}
              >
                <div className="profile-row-left">
                  <div className="profile-icon-bg bg-purple">
                    <img
                      src={profileIcon}
                      alt="그룹 관리"
                      className="profile-row-icon-img"
                    />
                  </div>
                  <div className="profile-row-text">
                    <h4>그룹 관리</h4>
                  </div>
                </div>
              </button>
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
                      src={exitIcon}
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
                      src={removeIcon}
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

          {showNotificationModal && (
            <div className="profile-modal-overlay">
              <div className="profile-modal-content">
                <h3 className="profile-modal-title">오늘의 질문 알림</h3>
                <p className="profile-modal-desc">
                  오늘의 질문 알림이 꺼졌어요.
                  <br />
                  언제든 설정에서 다시 켤 수 있어요.
                </p>
                <div className="profile-modal-actions">
                  <button
                    className="profile-modal-btn btn-cancel"
                    onClick={handleCancelTurnOff}
                  >
                    취소
                  </button>
                  <button
                    className="profile-modal-btn btn-confirm"
                    onClick={handleConfirmTurnOff}
                  >
                    ✓ 확인
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
