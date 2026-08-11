import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { axiosInstance } from '../apis/axiosInstance';

// 에셋 임포트
import heartIcon from '../assets/heart_icon.svg';
import copyIcon from '../assets/copy_icon.svg';
import qrGuideIcon from '../assets/qr_guide_icon.svg';

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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 헤더 */}
      <Header />

      {/* 중앙 컨텐츠 */}
      <div
        style={{
          position: 'absolute',
          top: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '312px',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={heartIcon}
          alt="하트 데코레이션"
          style={{
            marginTop: '12px',
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
      </div>

      {/* 하단 버튼: 친구 초대하기(공유) 하나만 */}
      <div
        style={{
          position: 'absolute',
          bottom: '94px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '312px',
          height: '48px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Button
          text="닫기"
          onClick={handleClose}
          style={{ width: '312px', height: '48px' }}
        />
      </div>

      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />
    </div>
  );
}