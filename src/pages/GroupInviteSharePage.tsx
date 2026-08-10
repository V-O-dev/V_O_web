import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { axiosInstance } from '../apis/axiosInstance'; // 프로젝트 구조에 맞게 경로 확인

// 에셋 임포트
import heartIcon from '../assets/heart_icon.svg'; 
import shareIcon from '../assets/share_icon.svg';   
import linkIcon from '../assets/link_icon.svg';     

export default function GroupInviteSharePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🎯 이전 페이지에서 넘어온 초대코드 및 groupId
  const inviteCode = location.state?.inviteCode; 
  const groupId = location.state?.groupId;
  const shareUrl = `${window.location.origin}/join?code=${inviteCode || ''}`;

  // QR 이미지 상태 관리
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isQrLoading, setIsQrLoading] = useState<boolean>(true);

  // 🎯 페이지 진입/복귀 시 안전하게 QR 이미지 받아오기 (Blob 메모리 관리 보완)
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
        // GET /api/v1/invites/{code}/qr?size=512
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

  // 클립보드 안전 복사 함수 (Document Focus 체크 추가)
  const copyToClipboard = async (text: string): Promise<boolean> => {
    // 🎯 문서 포커스 여부 및 secureContext 체크
    if (navigator.clipboard && window.isSecureContext && document.hasFocus()) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Clipboard API 실패, Fallback 실행:', err);
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

  // 1. 시스템 공유창 호출
  const handleShare = async () => {
    if (!inviteCode) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'v_O 그룹 초대',
          text: `v_O에서 초대장이 도착했어요! 초대코드: ${inviteCode}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('공유 취소 또는 에러:', err);
      }
    } else {
      await handleCopyLink();
    }
  };

  // 2. 클립보드 링크 복사 (사용자 명시적 클릭 시에만 실행)
  const handleCopyLink = async () => {
    if (!inviteCode) return;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      alert('초대 링크가 클립보드에 복사되었습니다! 🚀');
    } else {
      alert(`복사에 실패했습니다. 초대코드를 직접 공유해 주세요: ${inviteCode}`);
    }
  };

  // 3. 완료 버튼 클릭 시 이동
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
          
          {/* 링크 공유 버튼 */}
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

          {/* 링크 복사하기 버튼 */}
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

      {/* 4. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}