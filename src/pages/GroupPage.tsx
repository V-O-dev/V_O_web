import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GroupPage.css";
import { UserProfileInfo } from "@/components/common/Profile";
import { SubPageHeader } from "@/components/common/SubHeader";

import {
  GroupMemberSummary,
  PrivateGroupData,
  UpdateGroupPayload,
  MOCK_GROUP_DATA,
  MOCK_MEMBER_LIST,
} from "@/types/group";

type ModalType = "NONE" | "DELEGATE" | "KICK" | "LEAVE";

export default function GroupPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  const [groupInfo, setGroupInfo] = useState<PrivateGroupData | null>(null);
  const [groupName, setGroupName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [members, setMembers] = useState<GroupMemberSummary[]>([]);

  const [activeModal, setActiveModal] = useState<ModalType>("NONE");
  const [targetMember, setTargetMember] = useState<GroupMemberSummary | null>(
    null
  );

  useEffect(() => {
    setGroupInfo(MOCK_GROUP_DATA);
    setGroupName(MOCK_GROUP_DATA.name);
    setMembers(MOCK_MEMBER_LIST);
  }, [groupId]);

  // 로그인한 내가 그룹의 방장인지 판별
  const isCurrentLeader = members.find((m) => m.isMe)?.role === "OWNER";

  const handleOpenModal = (type: ModalType, member?: GroupMemberSummary) => {
    if (member) setTargetMember(member);
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal("NONE");
    setTargetMember(null);
  };

  // 그룹 설정 저장 이벤트
  const handleSaveGroup = () => {
    const updatePayload: UpdateGroupPayload = {
      name: groupName,
      groupImageUrl: groupInfo?.groupImageUrl,
    };
    console.log("백엔드로 보낼 그룹 데이터 Payload:", updatePayload);
    alert(`그룹 정보가 저장되었습니다.\n그룹명: ${updatePayload.name}`);
  };

  // 모달 내 확인 버튼 처리 함수
  const handleActionConfirm = () => {
    if (activeModal === "DELEGATE" && targetMember) {
      alert(`${targetMember.nickname}님에게 방장 권한을 위임했습니다.`);
    } else if (activeModal === "KICK" && targetMember) {
      alert(`${targetMember.nickname}님을 그룹에서 추방했습니다.`);
    } else if (activeModal === "LEAVE") {
      alert("그룹에서 탈퇴 처리되었습니다.");
      navigate("/");
    }
    handleCloseModal();
  };

  if (!groupInfo) {
    return <div className="group-loading">그룹 정보를 불러오는 중...</div>;
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
                src={groupInfo.groupImageUrl || "/src/assets/home/profile.svg"}
                alt="그룹 프로필"
                className="group-avatar-img"
                onError={(e) => {
                  e.currentTarget.src = "/src/assets/home/profile.svg";
                }}
              />
              <button className="group-camera-btn">
                <img src="/src/assets/profile/camera_button.svg" alt="카메라" />
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
                    <img src="/src/assets/profile/pencil_icon.svg" alt="편집" />
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
                const isOwner = member.role === "OWNER";

                return (
                  <div key={member.id} className="group-member-row">
                    <div
                      onClick={() =>
                        navigate(`/edit-nickname/${member.userId}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <UserProfileInfo
                        profileImageUrl={member.profileImageUrl}
                        nickname={member.nickname}
                        subText={isOwner ? "소유자 계정" : "그룹 멤버"}
                      />
                    </div>

                    <div className="group-member-actions">
                      {member.isMe && <span className="group-tag-me">나</span>}

                      {isOwner ? (
                        <img src="/src/assets/group/owner_button.svg"></img>
                      ) : isCurrentLeader ? (
                        <div className="group-leader-action-panel">
                          <button
                            className="group-btn-delegate"
                            onClick={() => handleOpenModal("DELEGATE", member)}
                          >
                            <img src="/src/assets/group/transfer_button.svg"></img>
                          </button>
                          <button
                            className="group-btn-kick"
                            onClick={() => handleOpenModal("KICK", member)}
                          >
                            <img src="/src/assets/group/remove_button.svg"></img>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              <div className="group-invite-row border-top">
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
                    <img
                      src="/src/assets/profile/remove_icon.svg"
                      alt="나가기"
                    />
                  </div>
                  <div className="group-row-text">
                    <h4 className="text-danger">그룹 나가기</h4>
                    <p>나가면 되돌릴 수 없어요</p>
                  </div>
                </div>
                <span className="group-arrow">〉</span>
              </button>

              <button
                className="group-row-btn border-top"
                onClick={() => alert("그룹 삭제 프로세스 진행")}
              >
                <div className="group-row-left">
                  <div className="group-danger-icon">
                    <img src="/src/assets/group/delete_icon.svg" alt="삭제" />
                  </div>
                  <div className="group-row-text">
                    <h4 className="text-danger">그룹 삭제하기</h4>
                    <p>모든 데이터가 삭제됩니다</p>
                  </div>
                </div>
                <span className="group-arrow">〉</span>
              </button>
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
                      {targetMember?.nickname}님
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
                    {targetMember?.nickname}님을 그룹에서 추방할까요?
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
