import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { CustomToast } from '../components/common/CustomToast';
import { axiosInstance } from '../apis/axiosInstance'; 

// 에셋 임포트
import heartIcon from '../assets/heart_icon.svg'; 
import shareIcon from '../assets/share_icon.svg';   
import linkIcon from '../assets/link_icon.svg';     

export default function GroupInviteSharePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 페이지에서 넘어온 초대코드 및 groupId
  const inviteCode = location.state?.inviteCode; 
  const groupId = location.state?.groupId;

  // 실제 배포된 Vercel 도메인 주소 적용
  const PRODUCTION_URL = 'https://v-o-web-1fqd.vercel.app';
  
  // 파란색 하이퍼링크 URL 생성
  const shareUrl = `${PRODUCTION_URL}/join?code=${inviteCode || ''}`;

  // QR 및 모달, 토스트 상태 관리
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isQrLoading, setIsQrLoading] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; subMessage?: string }>({
    isOpen: false,
    message: '',
    subMessage: ''
  });

  const showToast = (message: string, subMessage?: string) => {
    setToast({ isOpen: true, message, subMessage });
  };

  // QR 이미지 불러오기
  useEffect(() => {
    let active = true;
    let objectUrl = '';

    const fetchQrImage = async () => {
      if (!inviteCode) {
        setIsQrLoading(false);
        return;
      }

      try {
        setIsQrLoading(true);
        const response = await axiosInstance.get(`/api/v1/invites/${inviteCode}/qr`, {
          params: { size: 512 },
          responseType: 'blob'
        });

        if (active) {
          const blob = new Blob([response.data], { type: 'image/png' });
          objectUrl = URL.createObjectURL(blob);
          setQrImageUrl(objectUrl);
        }
      } catch (err) {
        console.error('QR 이미지 로딩 실패:', err);
      } finally {
        if (active) {
          setIsQrLoading(false);
        }
      }
    };

    fetchQrImage();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [inviteCode]);

  // 클립보드 복사 함수
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

  // 1. [링크 공유] 클릭 시 공유 선택 모달 열기
  const handleOpenShareModal = () => {
    if (!inviteCode) return;
    setIsShareModalOpen(true);
  };

  // 🎯 2. 모달 내에서 [문자 메시지(SMS)로 공유] 선택 시 실행
  const handleSmsShare = async () => {
    if (!inviteCode) return;

    const shareText = `v_O에서 그룹 초대장이 도착했어요!\n아래 링크를 눌러 들어오세요 🚀\n초대코드: ${inviteCode}\n${shareUrl}`;
    
    // 모바일 기기(iOS/Android) 체크
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 최신 모바일 OS 공통 표준 sms 스킴
      const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
      setIsShareModalOpen(false);
      window.location.href = smsUrl;
    } else {
      // PC 등 문자 앱 미지원 환경 예외 처리 (클립보드 자동 복사 + 토스트)
      const success = await copyToClipboard(shareText);
      setIsShareModalOpen(false);
      if (success) {
        showToast('모바일 전용 기능입니다.', '초대 메시지가 복사되었습니다.');
      }
    }
  };

  // 3. [링크 복사하기]
  const handleCopyLink = async () => {
    if (!inviteCode) return;

    const success = await copyToClipboard(shareUrl);
    if (success) {
      showToast('초대 링크가 복사되었습니다! 🎉', shareUrl);
    } else {
      showToast('복사 실패, 코드로 공유해 보세요', inviteCode);
    }
    setIsShareModalOpen(false);
  };

  // 완료 버튼 클릭 시 /group/name 페이지로 이동
  const handleComplete = () => {
    navigate('/group/name', {
      state: {
        ...location.state,
        groupId,
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

        {/* 타이틀 */}
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
          친구 초대하기
        </h1>

        {/* 동적 초대코드 */}
        <div style={{
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#000000',
            lineHeight: '24px',
            letterSpacing: '0.05em'
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
            {isQrLoading ? (
              <span style={{ fontSize: '13px', color: '#888' }}>QR 불러오는 중...</span>
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
              <span style={{ fontSize: '12px', color: '#ff4d4f' }}>QR 로딩 실패</span>
            )}
          </div>
        </div>

        {/* 하단 공유 & 복사 버튼 영역 */}
        <div style={{
          marginTop: '32px',
          display: 'flex',
          justifyContent: 'center',
          gap: '40px', 
          width: '100%'
        }}>
          
          {/* 1) 링크 공유 버튼 (클릭 시 공유 선택 모달 열림) */}
          <button 
            type="button"
            onClick={handleOpenShareModal}
            disabled={!inviteCode}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: inviteCode ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px' 
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#EDE8FD',
              borderRadius: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(126, 73, 233, 0.08)'
            }}>
              <img 
                src={shareIcon} 
                alt="링크 공유" 
                style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
              />
            </div>
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: '#8E8E93',
              whiteSpace: 'nowrap'
            }}>
              링크 공유
            </span>
          </button>

          {/* 2) 링크 복사하기 버튼 */}
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
              gap: '10px' 
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#EDE8FD',
              borderRadius: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(126, 73, 233, 0.08)'
            }}>
              <img 
                src={linkIcon} 
                alt="링크 복사하기" 
                style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
              />
            </div>
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: '#8E8E93',
              whiteSpace: 'nowrap'
            }}>
              링크 복사하기
            </span>
          </button>

        </div>

      </div>

      {/* 3. 하단 완료 버튼 영역 */}
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

      {/* 4. 공유 선택 모달 (팝업) */}
      {isShareModalOpen && (
        <div 
          onClick={() => setIsShareModalOpen(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px 32px 20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '16px', color: '#0F0F0F' }}>
                공유 방식 선택
              </span>
            </div>

            {/* SMS(문자 메시지) 공유 선택 버튼 */}
            <button
              type="button"
              onClick={handleSmsShare}
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: '#F5F2FF',
                border: 'none',
                borderRadius: '16px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: '#7E49E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              💬 문자 메시지(SMS)로 공유하기
            </button>

            {/* 초대 링크 복사 선택 버튼 */}
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: '#F8F9FA',
                border: 'none',
                borderRadius: '16px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: '#333333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              🔗 초대 링크 복사하기
            </button>

            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(false)}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: 'transparent',
                border: 'none',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#8E8E93',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 커스텀 토스트 알림 */}
      <CustomToast 
        isOpen={toast.isOpen}
        message={toast.message}
        subMessage={toast.subMessage}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />

      {/* 5. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}