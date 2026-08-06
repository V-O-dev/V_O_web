import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; 
import { Header } from '../components/common/Header';

// 에셋 임포트
import heartIcon from '../assets/heart_icon.svg'; 
import shareIcon from '../assets/share_icon.svg';   
import linkIcon from '../assets/link_icon.svg';     

export default function GroupInviteSharePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const inviteCode = location.state?.inviteCode || "NUFSOU9"; 
  const shareUrl = `${window.location.origin}/join?code=${inviteCode}`;

  // 🎯 HTTP 환경 및 구형 브라우저에서도 동작하는 안전한 텍스트 복사 함수
  const copyToClipboard = async (text: string): Promise<boolean> => {
    // 1) 최신 Clipboard API 시도 (HTTPS 또는 localhost 환경)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Clipboard API 실패, Fallback 실행:', err);
      }
    }

    // 2) HTTP / 미지원 환경용 레거시 Fallback 로직
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // 화면 밖으로 숨김
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

  // 1. 🎯 시스템 공유창 호출 (모바일 Web Share API)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'v_O 그룹 초대',
          text: `v_O에서 초대장이 도착했어요! 초대코드: ${inviteCode}`,
          url: shareUrl,
        });
      } catch (err) {
        // 사용자가 공유창을 취소했을 때 발생시키는 에러 무시
        console.log('공유 취소 또는 에러:', err);
      }
    } else {
      // 미지원 환경(PC 브라우저 등)에서는 클립보드 복사로 자동 대체
      await handleCopyLink();
    }
  };

  // 2. 🎯 클립보드 링크 복사
  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      alert('초대 링크가 클립보드에 복사되었습니다! 🚀');
    } else {
      alert(`복사에 실패했습니다. 초대코드를 직접 공유해 주세요: ${inviteCode}`);
    }
  };

  // 3. 완료 버튼 클릭 시 이동
  const handleComplete = () => {
    navigate('/group/name'); 
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

        {/* 초대코드 */}
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
            {inviteCode}
          </span>
          <div style={{
            width: '100%',
            height: '2px',
            backgroundColor: '#000000',
            marginTop: '1px' 
          }} />
        </div>

        {/* QR 카드 배경 */}
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
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
          }}>
            <QRCodeSVG 
              value={shareUrl} 
              size={188} 
              fgColor="#000000"
              bgColor="#ffffff"
              level="M"
            />
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
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
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
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
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