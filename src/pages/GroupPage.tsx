import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GroupPage.css";
import { UserProfileInfo } from "@/components/common/Profile";
import { SubPageHeader } from "@/components/common/SubHeader";

import { GroupMemberSummary, GroupDetailData } from "@/types/group";
import {
  fetchGroupDetail,
  updateGroupInfo,
  delegateGroupOwner,
  kickGroupMember,
  leaveGroup,
  deleteGroup,
  fetchMyProfile,
} from "@/apis/api";

import profileIcon from "@/assets/home/profile.svg";
import cameraButton from "@/assets/profile/camera_button.svg";
import pencilIcon from "@/assets/profile/pencil_icon.svg";
import ownerButton from "@/assets/group/owner_button.svg";
import transferButton from "@/assets/group/transfer_button.svg";
import removeButton from "@/assets/group/remove_button.svg";
import removeIcon from "@/assets/profile/remove_icon.svg";
import deleteIcon from "@/assets/group/delete_icon.svg";
import meIcon from "@/assets/group/me_icon.svg";

type ModalType = "NONE" | "DELEGATE" | "KICK" | "LEAVE" | "DELETE";

export default function GroupPage() {
  const navigate = useNavigate();
  const { groupId: paramGroupId } = useParams<{ groupId: string }>();
  const groupId = Number(paramGroupId);

  const [groupInfo, setGroupInfo] = useState<GroupDetailData | null>(null);
  const [groupName, setGroupName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [members, setMembers] = useState<GroupMemberSummary[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [activeModal, setActiveModal] = useState<ModalType>("NONE");
  const [targetMember, setTargetMember] = useState<GroupMemberSummary | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 그룹 정보 및 멤버 목록 조회
  const loadGroupDetail = async () => {
    if (!groupId) return;
    try {
      // 그룹 상세 정보와 내 프로필 정보를 동시에 가져옴
      const [data, myProfile] = await Promise.all([
        fetchGroupDetail(groupId),
        fetchMyProfile().catch(() => null), // 실패 시 null 처리
      ]);

      setGroupInfo(data);
      setGroupName(data.name);

      // members 배열을 순회하면서 '나'인 경우 내 실제 닉네임과 프로필 사진 적용
      const updatedMembers = (data.members || []).map((m) => {
        const isMe = myProfile ? m.userId === myProfile.userId : false;
        return {
          ...m,
          nickname: isMe && myProfile ? myProfile.nickname : m.nickname,
          profileImageUrl:
            isMe && myProfile ? myProfile.profileImageUrl : m.profileImageUrl,
          isMe,
        };
      });

      setMembers(updatedMembers);
    } catch (error) {
      console.error("그룹 상세 조회 실패:", error);
    }
  };

  useEffect(() => {
    loadGroupDetail();
  }, [groupId, location.pathname]);

  // 현재 로그인한 '나'가 방장인지 확인
  const isCurrentLeader = members.some(
    (m) => m.isMe && (m.role === "OWNER" || m.userId === groupInfo?.ownerUserId)
  );

  const handleOpenModal = (type: ModalType, member?: GroupMemberSummary) => {
    if (member) setTargetMember(member);
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal("NONE");
    setTargetMember(null);
  };

  // 상단 저장 버튼 클릭 시 그룹 수정
  const handleSaveGroup = async () => {
    if (!groupInfo) return;
    try {
      await updateGroupInfo(
        groupId,
        groupName,
        groupInfo.themeCode,
        selectedFile || undefined
      );
      console.log("그룹 정보가 성공적으로 저장되었습니다.");
      setIsEditingName(false);
      loadGroupDetail();
    } catch (error) {
      console.error("그룹 정보 수정 실패:", error);
      alert("그룹 정보 수정 중 오류가 발생했습니다.");
    }
  };

  // 카메라 버튼 클릭
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // 대표 이미지 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !groupInfo) return;

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setGroupInfo({
      ...groupInfo,
      imageUrl: previewUrl,
    });
  };

  // 모달 내 동작 실행 (위임, 추방, 나가기, 삭제 API)
  const handleActionConfirm = async () => {
    try {
      if (activeModal === "DELEGATE" && targetMember) {
        await delegateGroupOwner(groupId, targetMember.userId);
        console.log(`${targetMember.nickname}님에게 방장 권한을 위임했습니다.`);
        loadGroupDetail();
      } else if (activeModal === "KICK" && targetMember) {
        await kickGroupMember(groupId, targetMember.memberId);
        console.log(`${targetMember.nickname}님을 그룹에서 추방했습니다.`);
        loadGroupDetail();
      } else if (activeModal === "LEAVE") {
        await leaveGroup(groupId);
        console.log("그룹에서 나가기 처리되었습니다.");
        navigate("/Allgroup", { replace: true });
      } else if (activeModal === "DELETE") {
        await deleteGroup(groupId);
        console.log("그룹이 삭제되었습니다.");
        navigate("/Allgroup", { replace: true });
      }
    } catch (error) {
      console.error("그룹 요청 처리 실패:", error);
      alert("요청 처리 중 오류가 발생했습니다.");
    } finally {
      handleCloseModal();
    }
  };

  if (!groupInfo) {
    return null;
  }

  return (
    <div className="group-app-wrapper">
      <div className="group-phone-screen">
        <SubPageHeader
          title="그룹 설정"
          leftType="close"
          onSave={handleSaveGroup}
        />

        <main className="group-main-content">
          <div className="group-avatar-container">
            <div className="group-avatar-main">
              <img
                src={groupInfo.imageUrl || profileIcon}
                alt="그룹 프로필"
                className="group-avatar-img"
                onError={(e) => {
                  e.currentTarget.src = profileIcon;
                }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button className="group-camera-btn" onClick={handleCameraClick}>
                <img src={cameraButton} alt="카메라" />
              </button>
            </div>

            <div className="group-name-wrapper">
              {isEditingName ? (
                <input
                  type="text"
                  className="group-name-input"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  autoFocus
                />
              ) : (
                <>
                  <span className="group-name-text">{groupName}</span>
                  <button
                    className="group-edit-name-btn"
                    onClick={() => setIsEditingName(true)}
                  >
                    <img src={pencilIcon} alt="편집" />
                  </button>
                </>
              )}
            </div>
            <p className="group-sub-text">
              누구나 사진과 이름을 변경할 수 있어요
            </p>
          </div>

          <div className="group-section">
            <div className="group-section-header">
              <span className="group-section-title">그룹 멤버 관리</span>
              <span className="group-count-badge">{members.length}명</span>
            </div>

            <div className="group-card">
              {members.map((member) => {
                const isOwner =
                  member.role === "OWNER" ||
                  member.userId === groupInfo.ownerUserId;

                return (
                  <div
                    key={member.memberId || member.userId}
                    className="group-member-row"
                  >
                    <div
                      onClick={() => {
                        if (!member.isMe) {
                          navigate(
                            `/group/${groupId}/member/${member.memberId}/edit-nickname`,
                            {
                              state: { member },
                            }
                          );
                        }
                      }}
                      style={{ cursor: member.isMe ? "default" : "pointer" }}
                    >
                      <UserProfileInfo
                        profileImageUrl={member.profileImageUrl}
                        nickname={
                          member.displayName ||
                          member.alias ||
                          member.nickname ||
                          `유저 ${member.userId}`
                        }
                        subText={member.isMe ? "소유자 계정" : "그룹 멤버"}
                      />
                    </div>

                    <div className="group-member-actions">
                      {isOwner ? (
                        <img
                          src={ownerButton}
                          alt="소유자"
                          className="group-owner-badge"
                        />
                      ) : isCurrentLeader ? (
                        <div className="group-leader-action-panel">
                          <button
                            className="group-btn-delegate"
                            onClick={() => handleOpenModal("DELEGATE", member)}
                          >
                            <img src={transferButton} alt="위임" />
                          </button>
                          <button
                            className="group-btn-kick"
                            onClick={() => handleOpenModal("KICK", member)}
                          >
                            <img src={removeButton} alt="추방" />
                          </button>
                        </div>
                      ) : null}

                      {member.isMe && (
                        <img
                          src={meIcon}
                          alt="나"
                          className="group-tag-me-img"
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              <div
                className="group-invite-row border-top"
                onClick={() => navigate(`/group/${groupId}/invite`)}
                style={{ cursor: "pointer" }}
              >
                <div className="group-invite-left">
                  <div className="group-invite-plus-circle">+</div>
                  <div className="group-invite-text">
                    <h4>멤버 초대하기</h4>
                    <p>초대코드로 친구를 불러오세요</p>
                  </div>
                </div>
                <span className="group-arrow">〉</span>
              </div>
            </div>
          </div>

          <div className="group-section">
            <div className="group-card danger-card">
              <button
                className="group-row-btn"
                onClick={() => handleOpenModal("LEAVE")}
              >
                <div className="group-row-left">
                  <div className="group-danger-icon">
                    <img src={removeIcon} alt="나가기" />
                  </div>
                  <div className="group-row-text">
                    <h4 className="text-danger">그룹 나가기</h4>
                    <p>나가면 되돌릴 수 없어요</p>
                  </div>
                </div>
                <span className="group-arrow">〉</span>
              </button>

              {isCurrentLeader && (
                <button
                  className="group-row-btn border-top"
                  onClick={() => handleOpenModal("DELETE")}
                >
                  <div className="group-row-left">
                    <div className="group-danger-icon">
                      <img src={deleteIcon} alt="삭제" />
                    </div>
                    <div className="group-row-text">
                      <h4 className="text-danger">그룹 삭제하기</h4>
                      <p>모든 데이터가 삭제됩니다</p>
                    </div>
                  </div>
                  <span className="group-arrow">〉</span>
                </button>
              )}
            </div>
          </div>
        </main>

        {activeModal !== "NONE" && (
          <div className="group-modal-overlay">
            <div className="group-modal-window">
              {activeModal === "DELEGATE" && (
                <>
                  <h3 className="group-modal-title">방장 권한을 위임할까요?</h3>
                  <p className="group-modal-desc">
                    정말{" "}
                    <span className="group-highlight">
                      {targetMember?.nickname || "멤버"}님
                    </span>
                    에게 방장 자리를 넘기시겠어요?
                    <br />
                    위임 후에는 멤버 관리 권한이 해제됩니다.
                  </p>
                  <div className="group-modal-buttons">
                    <button
                      className="group-modal-btn-cancel"
                      onClick={handleCloseModal}
                    >
                      취소
                    </button>
                    <button
                      className="group-modal-btn-confirm btn-yellow"
                      onClick={handleActionConfirm}
                    >
                      위임하기
                    </button>
                  </div>
                </>
              )}

              {activeModal === "KICK" && (
                <>
                  <h3 className="group-modal-title">
                    {targetMember?.nickname || "멤버"}님을 그룹에서 추방할까요?
                  </h3>
                  <p className="group-modal-desc">
                    추방된 멤버는 더 이상 우리 그룹 질문
                    <br />
                    피드 기록을 볼 수 없게 됩니다.
                  </p>
                  <div className="group-modal-buttons">
                    <button
                      className="group-modal-btn-cancel"
                      onClick={handleCloseModal}
                    >
                      취소
                    </button>
                    <button
                      className="group-modal-btn-confirm btn-red"
                      onClick={handleActionConfirm}
                    >
                      추방하기
                    </button>
                  </div>
                </>
              )}

              {activeModal === "LEAVE" && (
                <>
                  <h3 className="group-modal-title">
                    정말 그룹을 나가시겠습니까?
                  </h3>
                  <p className="group-modal-desc">
                    그룹을 나가면 그동안 소중한 기록들이
                    <br />
                    모두 보관함에서 삭제됩니다.
                  </p>
                  <div className="group-modal-buttons">
                    <button
                      className="group-modal-btn-cancel"
                      onClick={handleCloseModal}
                    >
                      취소
                    </button>
                    <button
                      className="group-modal-btn-confirm btn-red"
                      onClick={handleActionConfirm}
                    >
                      나가기
                    </button>
                  </div>
                </>
              )}

              {activeModal === "DELETE" && (
                <>
                  <h3 className="group-modal-title">
                    정말 그룹을 삭제하시겠습니까?
                  </h3>
                  <p className="group-modal-desc">
                    그룹을 삭제하면 남아있는 멤버 전원이 나가지고
                    <br />
                    모든 질문 및 기록 데이터가 삭제됩니다.
                  </p>
                  <div className="group-modal-buttons">
                    <button
                      className="group-modal-btn-cancel"
                      onClick={handleCloseModal}
                    >
                      취소
                    </button>
                    <button
                      className="group-modal-btn-confirm btn-red"
                      onClick={handleActionConfirm}
                    >
                      삭제하기
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
