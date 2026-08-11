import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./EditNicknamePage.css";
import { SubPageHeader } from "@/components/common/SubHeader";
import { fetchGroupDetail, updateMemberAlias } from "@/apis/api";
import profileIcon from "@/assets/home/profile.svg";

interface TargetUserProfile {
  memberId: number;
  originalName: string;
  customName: string;
  profileImageUrl: string | null;
}

export default function EditNicknamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId: paramGroupId, memberId: paramMemberId } = useParams<{
    groupId: string;
    memberId: string;
  }>();

  const groupId = Number(paramGroupId);
  const memberId = Number(paramMemberId);

  const [userInfo, setUserInfo] = useState<TargetUserProfile | null>(null);
  const [nicknameInput, setNicknameInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTargetMember = async () => {
      // 이전 페이지(GroupPage)에서 state로 멤버 정보를 넘겨받은 경우 바로 사용
      if (location.state?.member) {
        const m = location.state.member;
        setUserInfo({
          memberId: m.memberId,
          originalName: m.nickname || `유저 ${m.userId}`,
          customName: m.alias || m.displayName || "",
          profileImageUrl: m.profileImageUrl ?? null,
        });
        setNicknameInput(m.alias || m.displayName || "");
        setLoading(false);
        return;
      }

      // direct 진입 시 그룹 상세조회 API를 통해 대상 멤버 정보 추출
      if (!groupId || !memberId) return;
      try {
        const groupData = await fetchGroupDetail(groupId);
        const target = (groupData.members || []).find(
          (m: any) => m.memberId === memberId
        );

        if (target) {
          setUserInfo({
            memberId: target.memberId,
            originalName: target.nickname || `유저 ${target.userId}`,
            customName: target.alias || target.displayName || "",
            profileImageUrl: target.profileImageUrl ?? null,
          });
          setNicknameInput(target.alias || target.displayName || "");
        }
      } catch (error) {
        console.error("멤버 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTargetMember();
  }, [groupId, memberId, location.state]);

  const handleClearInput = () => {
    setNicknameInput("");
  };

  const handleSave = async () => {
    if (!groupId || !memberId) {
      console.log("그룹 또는 멤버 정보가 유효하지 않습니다.");
      return;
    }

    try {
      await updateMemberAlias(groupId, memberId, nicknameInput.trim());
      navigate(-1);
    } catch (error) {
      console.error("호칭 수정 실패:", error);
    }
  };

  if (loading || !userInfo) {
    return null;
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
                  e.currentTarget.src = profileIcon;
                }}
              />
            </div>
            <p className="edit-nickname-original-text">
              상대방이 설정한 원래 이름은 '{userInfo.originalName}'입니다.
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
