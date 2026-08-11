import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { SubPageHeader } from "@/components/common/SubHeader";
import { UserProfileData } from "@/types/user";
import {
  fetchMyProfile,
  updateNickname,
  updateProfileImage,
  updateNotificationSettings,
  logoutApi,
  withdrawApi,
} from "@/apis/api";

import profileIcon from "@/assets/home/profile.svg";
import cameraButton from "@/assets/profile/camera_button.svg";
import pencilIcon from "@/assets/profile/pencil_icon.svg";
import starIcon from "@/assets/profile/star_icon.svg";
import lineheartIcon from "@/assets/profile/lineheart_icon.svg";
import exitIcon from "@/assets/profile/exit_icon.svg";
import removeIcon from "@/assets/profile/remove_icon.svg";
import groupButton from "@/assets/profile/group_btn.svg";

// 모달 타입 선언 (알림 해제 / 로그아웃 / 회원탈퇴)
type ModalType = "NONE" | "NOTIFICATION_OFF" | "LOGOUT" | "WITHDRAW";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // 현재 열려있는 모달 상태 관리
  const [activeModal, setActiveModal] = useState<ModalType>("NONE");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 내 정보 초기 조회
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMyProfile();
        setProfile(data);
        setNameInput(data.nickname);
      } catch (error) {
        console.error("프로필 정보 불러오기 실패", error);
      }
    };
    loadProfile();
  }, []);

  // 닉네임 저장
  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      await updateNickname(nameInput);
      setProfile({ ...profile, nickname: nameInput });
      setIsEditingName(false);
      console.log("프로필이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("닉네임 수정 실패:", error);
      console.log("닉네임 수정 중 오류가 발생했습니다.");
    }
  };

  // 알림 토글 변경
  const handleToggleNotification = async (
    key: "questionNotification" | "interactionNotification"
  ) => {
    if (!profile) return;

    const currentVal = profile[key];

    // 오늘의 질문 알림 켜짐(true) 상태에서 끌 때만 모달 오픈
    if (key === "questionNotification" && currentVal === true) {
      setActiveModal("NOTIFICATION_OFF");
    } else {
      const updatedProfile = { ...profile, [key]: !currentVal };
      try {
        await updateNotificationSettings({
          questionNotification: updatedProfile.questionNotification,
          interactionNotification: updatedProfile.interactionNotification,
        });
        setProfile(updatedProfile);
      } catch (error) {
        console.error("알림 설정 변경 실패:", error);
      }
    }
  };

  // 알림 끄기 모달 확인
  const handleConfirmTurnOff = async () => {
    if (!profile) return;
    const updatedProfile = { ...profile, questionNotification: false };
    try {
      await updateNotificationSettings({
        questionNotification: false,
        interactionNotification: updatedProfile.interactionNotification,
      });
      setProfile(updatedProfile);
    } catch (error) {
      console.error("알림 설정 변경 실패:", error);
    } finally {
      setActiveModal("NONE");
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 프로필 이미지 변경
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      const res = await updateProfileImage(file);
      setProfile({
        ...profile,
        profileImageUrl: res.profileImageUrl,
      });
      console.log("프로필 이미지가 변경되었습니다.");
    } catch (error) {
      console.error("프로필 이미지 변경 실패:", error);
      console.log("이미지 업로드에 실패했습니다.");
    }
  };

  // 실제 로그아웃 진행 함수
  const handleConfirmLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken") || "";
    try {
      await logoutApi(refreshToken);
    } catch (error) {
      console.error("로그아웃 요청 실패", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setActiveModal("NONE");
      navigate("/login");
    }
  };

  // 실제 회원 탈퇴 진행 함수
  const handleConfirmWithdraw = async () => {
    try {
      await withdrawApi();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setActiveModal("NONE");
      console.log("회원 탈퇴가 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      console.log("회원 탈퇴 중 오류가 발생했습니다.");
      setActiveModal("NONE");
    }
  };

  if (!profile) {
    return null;
  }

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
                    checked={profile.questionNotification}
                    onChange={() =>
                      handleToggleNotification("questionNotification")
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
                    checked={profile.interactionNotification}
                    onChange={() =>
                      handleToggleNotification("interactionNotification")
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
                  <img
                    src={groupButton}
                    alt="그룹 관리"
                    className="profile-row-icon-img"
                    style={{ width: 32, height: 32 }}
                  />
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
                onClick={() => setActiveModal("LOGOUT")}
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
                onClick={() => setActiveModal("WITHDRAW")}
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

          {/* 팝업 모달 (알림 끄기 / 로그아웃 / 회원탈퇴) */}
          {activeModal !== "NONE" && (
            <div className="profile-modal-overlay">
              <div className="profile-modal-content">
                {activeModal === "NOTIFICATION_OFF" && (
                  <>
                    <h3 className="profile-modal-title">오늘의 질문 알림</h3>
                    <p className="profile-modal-desc">
                      오늘의 질문 알림이 꺼졌어요.
                      <br />
                      언제든 설정에서 다시 켤 수 있어요.
                    </p>
                    <div className="profile-modal-actions">
                      <button
                        className="profile-modal-btn btn-cancel"
                        onClick={() => setActiveModal("NONE")}
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
                  </>
                )}

                {activeModal === "LOGOUT" && (
                  <>
                    <h3 className="profile-modal-title">
                      정말 로그아웃 할까요?
                    </h3>
                    <p className="profile-modal-desc">
                      로그아웃 하더라도 소중한 기록은
                      <br />
                      안전하게 보관돼요.
                    </p>
                    <div className="profile-modal-actions">
                      <button
                        className="profile-modal-btn btn-cancel"
                        onClick={() => setActiveModal("NONE")}
                      >
                        취소
                      </button>
                      <button
                        className="profile-modal-btn btn-red-confirm"
                        onClick={handleConfirmLogout}
                      >
                        ✓ 로그아웃
                      </button>
                    </div>
                  </>
                )}

                {activeModal === "WITHDRAW" && (
                  <>
                    <h3 className="profile-modal-title">회원을 탈퇴할까요?</h3>
                    <p className="profile-modal-desc">
                      회원탈퇴하면 지금까지 함께한
                      <br />
                      소중한 기록과 계정 정보가 모두 삭제됩니다.
                    </p>
                    <div className="profile-modal-actions">
                      <button
                        className="profile-modal-btn btn-cancel"
                        onClick={() => setActiveModal("NONE")}
                      >
                        취소
                      </button>
                      <button
                        className="profile-modal-btn btn-red-confirm"
                        onClick={handleConfirmWithdraw}
                      >
                        ✓ 탈퇴하기
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
