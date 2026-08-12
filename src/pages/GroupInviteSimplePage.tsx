import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { CustomToast } from '../components/common/CustomToast';
import { axiosInstance } from '../apis/axiosInstance';

// 에셋 임포트
import heartIcon from '../assets/heart_icon.svg';
import copyIcon from '../assets/copy_icon.svg';
import qrGuideIcon from '../assets/qr_guide_icon.svg';
import shareIcon from '../assets/share_icon.svg';
import linkIcon from '../assets/link_icon.svg';

// 🎯 실제 배포된 프로덕션 도메인 (GroupInviteSharePage와 동일하게 유지)
const PRODUCTION_URL = 'https://v-o-web-1fqd.vercel.app';

/**
 * 이미 존재하는 그룹의 초대코드/QR을 보여주는 화면.
 * GroupPage에서 navigate(`/group/${groupId}/invite`)로 진입한다고 가정.
 *
 * ⚠️ 주의: /invite-code 엔드포인트가 POST(생성)로 되어 있어서,
 * 이 화면에 재진입할 때마다 새 코드가 발급될 수 있습니다.
 * 만약 서버에 "기존 코드 조회용" GET 엔드포인트가 따로 있다면
 * 아래 fetchInviteCode 함수 안의 axiosInstance.post 부분을
 * axiosInstance.get으로 바꿔주세요.
 */
export default function GroupInviteSimplePage() {
  const navigate = useNavigate();
  const { groupId: paramGroupId } = useParams<{ groupId: string }>();
  const groupId = Number(paramGroupId);

  const [inviteCode, setInviteCode] = useState<string>('');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    subMessage?: string;
  }>({ isOpen: false, message: '', subMessage: '' });

  const showToast = (message: string, subMessage?: string) => {
    setToast({ isOpen: true, message, subMessage });
  };

  const shareUrl = `${PRODUCTION_URL}/join?code=${inviteCode || ''}`;

  useEffect(() => {
    let objectUrl = '';

    const fetchInviteAndQr = async () => {
      if (!groupId) {
        setErrorMsg('유효한 그룹 정보가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMsg(null);

        // 1. 초대코드 발급/조회
        // 스웨거 설명: "아직 유효한 초대 코드가 있으면 그 코드를 반환하고,
        // 없으면 24시간짜리 코드를 새로 발급합니다." → POST여도 안전하게 재사용됨.
        const codeRes = await axiosInstance.post(
          `/api/v1/groups/${groupId}/invite-code`
        );
        const data = codeRes.data?.data;
        const code: string | undefined = data?.code;

        if (!code) {
          setErrorMsg('초대코드를 발급받지 못했습니다.');
          return;
        }
        setInviteCode(code);

        // 2. QR 이미지 조회
        // 확인됨: 응답의 data.qrImageUrl(/invites/{code}/qr, 접두사 없음)은 500 에러 발생.
        // 실제로는 /api/v1 접두사가 붙은 경로가 정상 동작(200)함.
        const qrRes = await axiosInstance.get(
          `/api/v1/invites/${code}/qr`,
          { responseType: 'blob' }
        );
        const blob = new Blob([qrRes.data], { type: 'image/png' });
        objectUrl = URL.createObjectURL(blob);
        setQrImageUrl(objectUrl);
      } catch (err: any) {
        console.error('초대 코드 발급 또는 QR 조회 실패:', err);
        setErrorMsg(
          err.response?.status === 401
            ? '로그인이 필요합니다.'
            : err.response?.status === 404
            ? '존재하지 않는 코드입니다.'
            : '초대 정보를 불러오지 못했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInviteAndQr();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [groupId]);

  const handleCopyCode = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setIsCopied(true);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleClose = () => {
    // 그룹 설정 화면으로 복귀
    navigate(-1);
  };

  // 클립보드 복사 (HTTPS 미지원/구형 브라우저 대비 fallback 포함)
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Clipboard API 실패:', err);
      }
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback 복사 실패:', err);
      return false;
    }
  };

  // 링크 공유 (Web Share API, 미지원 시 텍스트 복사로 대체)
  const handleShare = async () => {
    if (!inviteCode) return;

    const shareData = {
      title: 'v_O 그룹 초대',
      text: `v_O에서 그룹 초대장이 도착했어요!\n아래 링크를 눌러 들어오세요 🚀\n초대코드: ${inviteCode}\n`,
      url: shareUrl,
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // 사용자가 공유 취소
        console.log('공유 실패');
      }
    }

    const success = await copyToClipboard(`${shareData.text}${shareUrl}`);
    if (success) {
      showToast('초대 링크 메시지가 복사되었습니다! 🚀', shareUrl);
    } else {
      showToast('초대코드', inviteCode);
    }
  };

  // 링크만 복사
  const handleCopyLink = async () => {
    if (!inviteCode) return;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      showToast('초대 링크가 복사되었습니다! 🎉', shareUrl);
    } else {
      showToast('복사 실패, 코드로 공유해 보세요', inviteCode);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '360px',
        height: '800px',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* 헤더 */}
      <Header />

      {/* 중앙 컨텐츠: 남는 공간을 채우고, 넘치면 스크롤 (더 이상 절대좌표 아님) */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '312px',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={heartIcon}
          alt="하트 데코레이션"
          style={{
            marginTop: '8px',
            width: '77.4px',
            height: '39.6px',
            objectFit: 'contain',
          }}
        />

        <h1
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '20px',
            fontWeight: 500,
            color: '#0F0F0F',
            margin: '8px 0 0 0',
            lineHeight: '30px',
            letterSpacing: '0em',
            textAlign: 'center',
          }}
        >
          내 초대코드
        </h1>

        {/* QR 카드 */}
        <div
          style={{
            marginTop: '20px',
            width: '260px',
            height: '260px',
            backgroundColor: '#F5F2FF',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              width: '226px',
              height: '226px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
              overflow: 'hidden',
            }}
          >
            {isLoading ? (
              <span style={{ fontSize: '13px', color: '#888' }}>
                초대 코드 불러오는 중...
              </span>
            ) : qrImageUrl ? (
              <img
                src={qrImageUrl}
                alt="초대 QR 코드"
                style={{
                  width: '188px',
                  height: '188px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <span style={{ fontSize: '12px', color: '#ff4d4f' }}>
                {errorMsg || 'QR 로딩 실패'}
              </span>
            )}
          </div>
        </div>

        {/* 초대코드 텍스트 & 복사 버튼 */}
        <div
          style={{
            marginTop: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            height: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '28px',
                fontWeight: 700,
                color: '#000000',
                lineHeight: '34px',
                letterSpacing: '0.05em',
                userSelect: 'all',
              }}
            >
              {inviteCode || '------'}
            </span>
            <div
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#000000',
                marginTop: '1px',
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            disabled={!inviteCode}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: inviteCode ? 'pointer' : 'default',
              padding: 0,
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                backgroundColor: isCopied ? '#22C55E' : '#EDE8FD',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease',
              }}
            >
              {isCopied ? (
                <svg
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 7L6.5 11.5L16 2"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <img
                  src={copyIcon}
                  alt="복사"
                  style={{
                    width: '15px',
                    height: '15px',
                    objectFit: 'contain',
                  }}
                />
              )}
            </div>
          </button>
        </div>

        {/* 하단 가이드 박스 */}
        <div
          style={{
            marginTop: '24px',
            width: isCopied ? 'fit-content' : '264px',
            height: '56px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: isCopied ? '4px 16px' : '4px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isCopied ? '12px' : '10px',
            boxSizing: 'border-box',
            boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.10)',
            transition: 'all 0.2s ease',
          }}
        >
          {isCopied ? (
            <>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#22C55E',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg
                  width="13"
                  height="10"
                  viewBox="0 0 13 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 5L4.8 8.3L11.5 1.7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 500,
                    fontSize: '13px',
                    lineHeight: '19.5px',
                    letterSpacing: '-0.1px',
                    color: '#000000',
                    whiteSpace: 'nowrap',
                  }}
                >
                  초대코드가 복사됐어요
                </span>

                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <img
                src={qrGuideIcon}
                alt="안내"
                style={{
                  width: '30px',
                  height: '30px',
                  objectFit: 'contain',
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  fontFamily: 'Manrope, sans-serif',
                  lineHeight: '1.25',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '12.5px',
                    color: '#0F0F0F',
                    whiteSpace: 'nowrap',
                  }}
                >
                  QR코드를 스캔하면
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: '11.5px',
                    color: '#8E8E93',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  친구가 바로 V_O에 참여할 수 있어요!
                </span>
              </div>
            </>
          )}
        </div>

        {/* 링크 공유 & 링크 복사 버튼 */}
        <div
          style={{
            marginTop: '28px',
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            width: '100%',
          }}
        >
          <button
            type="button"
            onClick={handleShare}
            disabled={!inviteCode}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: inviteCode ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#EDE8FD',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(126, 73, 233, 0.08)',
              }}
            >
              <img
                src={shareIcon}
                alt="링크 공유"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              />
            </div>
            <span
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                color: '#8E8E93',
                whiteSpace: 'nowrap',
              }}
            >
              링크 공유
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            disabled={!inviteCode}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: inviteCode ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#EDE8FD',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(126, 73, 233, 0.08)',
              }}
            >
              <img
                src={linkIcon}
                alt="링크 복사하기"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              />
            </div>
            <span
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                color: '#8E8E93',
                whiteSpace: 'nowrap',
              }}
            >
              링크 복사하기
            </span>
          </button>
        </div>
      </div>

      {/* 하단 버튼: 닫기 (일반 flex 흐름 — 콘텐츠 길이와 무관하게 항상 맨 아래 고정) */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: '12px 0 32px 0',
          boxSizing: 'border-box',
        }}
      >
        <Button
          text="닫기"
          onClick={handleClose}
          style={{ width: '312px', height: '48px' }}
        />
      </div>

      {/* 커스텀 토스트 알림 */}
      <CustomToast
        isOpen={toast.isOpen}
        message={toast.message}
        subMessage={toast.subMessage}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}