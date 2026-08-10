import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { axiosInstance } from '../apis/axiosInstance';

// 에셋 임포트
import heartIcon from '../assets/heart_icon.svg'; 
import copyIcon from '../assets/copy_icon.svg';     
import qrGuideIcon from '../assets/qr_guide_icon.svg'; 

export default function GroupInvitePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 스텝에서 넘어온 groupId 및 inviteCode
  const groupId = location.state?.groupId;
  const initialInviteCode = location.state?.inviteCode;

  const [inviteCode, setInviteCode] = useState<string>(initialInviteCode || '');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl = '';

    const fetchInviteAndQr = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        let activeCode = inviteCode;

        // 🎯 1. 만약 넘겨받은 inviteCode가 없지만 groupId가 있다면 직접 발급 API 호출!
        if (!activeCode && groupId) {
          const codeRes = await axiosInstance.post(`/api/v1/groups/${groupId}/invite-code`);
          // 스웨거 응답 구조에 맞게 추출 (result / data)
          activeCode = codeRes.data.data?.code || codeRes.data.result?.code || codeRes.data.code;
          setInviteCode(activeCode);
        }

        // 🎯 2. 확보된 진짜 inviteCode로 QR 이미지 조회 (Blob)
        if (activeCode) {
          const qrRes = await axiosInstance.get(`/api/v1/invites/${activeCode}/qr`, {
            params: { size: 512 },
            responseType: 'blob'
          });

          const blob = new Blob([qrRes.data], { type: 'image/png' });
          objectUrl = URL.createObjectURL(blob);
          setQrImageUrl(objectUrl);
        } else {
          // groupId도 없고 inviteCode도 없는 경우 fallback
          setErrorMsg("유효한 그룹 정보가 없습니다.");
        }
      } catch (err: any) {
        console.error('초대 코드 발급 또는 QR 조회 실패:', err);
        setErrorMsg(err.response?.status === 404 ? '존재하지 않는 코드입니다.' : '초대 정보를 불러오지 못했습니다.');
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

  const handleShare = () => {
    navigate('/group/invite-share', { 
      state: { 
        ...location.state, 
        inviteCode,
        qrImageUrl 
      } 
    });
  };

  const handleComplete = () => {
    navigate('/group/name', { 
      state: { 
        ...location.state, 
        inviteCode 
      } 
    }); 
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      width: '100%',
      maxWidth: '360px', 
      height: '800px',    
      margin: '0 auto',  
      boxSizing: 'border-box',
      position: 'relative', 
      overflow: 'hidden'
    }}>
      
      {/* 1. 공통 헤더 */}
      <Header />

      {/* 2. 중앙 컨텐츠 영역 */}
      <div style={{
        position: 'absolute',
        top: '64px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '312px',
        boxSizing: 'border-box'
      }}>
        
        {/* 하트 아이콘 */}
        <img 
          src={heartIcon} 
          alt="하트 데코레이션" 
          style={{ 
            marginTop: '12px',
            width: '77.4px', 
            height: '39.6px', 
            objectFit: 'contain' 
          }} 
        />

        {/* "내 초대코드" 타이틀 */}
        <h1 style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '20px',
          fontWeight: 500,
          color: '#0F0F0F',
          margin: '8px 0 0 0',
          lineHeight: '30px',
          letterSpacing: '0em',
          textAlign: 'center'
        }}>
          내 초대코드
        </h1>

        {/* QR 카드 영역 */}
        <div style={{
          marginTop: '20px', 
          width: '260px',
          height: '260px',
          backgroundColor: '#F5F2FF', 
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            width: '226px',
            height: '226px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            overflow: 'hidden'
          }}>
            {isLoading ? (
              <span style={{ fontSize: '13px', color: '#888' }}>초대 코드 생성 중...</span>
            ) : qrImageUrl ? (
              <img 
                src={qrImageUrl} 
                alt="초대 QR 코드" 
                style={{
                  width: '188px',
                  height: '188px',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <span style={{ fontSize: '12px', color: '#ff4d4f' }}>{errorMsg || 'QR 로딩 실패'}</span>
            )}
          </div>
        </div>

        {/* 초대코드 텍스트 & 복사 버튼 */}
        <div style={{
          marginTop: '22px', 
          display: 'flex',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '16px', 
          height: '40px'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
          }}>
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '28px',
              fontWeight: 700,
              color: '#000000',
              lineHeight: '34px',
              letterSpacing: '0.05em',
              userSelect: 'all'
            }}>
              {inviteCode || "------"}
            </span>
            <div style={{
              width: '100%',
              height: '2px',
              backgroundColor: '#000000',
              marginTop: '1px' 
            }} />
          </div>
          
          {/* 복사 버튼 */}
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
              flexShrink: 0
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              backgroundColor: isCopied ? '#22C55E' : '#EDE8FD',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}>
              {isCopied ? (
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 7L6.5 11.5L16 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <img 
                  src={copyIcon} 
                  alt="복사" 
                  style={{ 
                    width: '15px', 
                    height: '15px', 
                    objectFit: 'contain'
                  }} 
                />
              )}
            </div>
          </button>
        </div>

        {/* 하단 가이드 박스 */}
        <div style={{
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
          transition: 'all 0.2s ease'
        }}>
          {isCopied ? (
            <>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#22C55E', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 5L4.8 8.3L11.5 1.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ 
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 500,        
                  fontSize: '13px',       
                  lineHeight: '19.5px',   
                  letterSpacing: '-0.1px',
                  color: '#000000',       
                  whiteSpace: 'nowrap' 
                }}>
                  초대코드가 복사됐어요
                </span>

                <div style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#10B981',
                  borderRadius: '50%',
                  flexShrink: 0
                }} />
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
                  flexShrink: 0
                }} 
              />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                fontFamily: 'Manrope, sans-serif',
                lineHeight: '1.25'
              }}>
                <span style={{ fontWeight: 600, fontSize: '12.5px', color: '#0F0F0F', whiteSpace: 'nowrap' }}>
                  QR코드를 스캔하면
                </span>
                <span style={{ fontWeight: 400, fontSize: '11.5px', color: '#8E8E93', whiteSpace: 'nowrap', marginTop: '2px' }}>
                  친구가 바로 V_O에 참여할 수 있어요!
                </span>
              </div>
            </>
          )}
        </div>

      </div>

      {/* 3. 하단 버튼 영역 */}
      <div style={{
        position: 'absolute',
        bottom: '152px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '312px',
        height: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        <Button 
          text="친구 초대하기" 
          onClick={handleShare} 
          style={{ width: '312px', height: '48px' }}
        />
      </div>

      <div style={{
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
      }}>
        <button
          type="button"
          onClick={handleComplete}
          style={{
            border: 'none',
            background: '#0F0F0F', 
            fontFamily: 'Manrope, sans-serif',
            fontSize: '16px',
            fontWeight: 600, 
            lineHeight: '22px', 
            color: '#ffffff', 
            width: '312px',
            height: '48px',
            borderRadius: '16px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          완료
        </button>
      </div>

      {/* 4. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}