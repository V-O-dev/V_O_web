import React from 'react';
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

  // 1. 링크 공유 기능
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'v_O 그룹 초대',
          text: `함께 질문을 주고받아요! 초대코드: ${inviteCode}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('공유 취소 또는 에러:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('초대 링크가 클립보드에 복사되었습니다! 🚀');
      } catch (err) {
        alert('초대 코드: ' + inviteCode);
      }
    }
  };

  // 2. 링크 복사 기능
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('초대 링크가 클립보드에 복사되었습니다! 🎉');
    } catch (err) {
      console.error('링크 복사 실패:', err);
    }
  };

  // 3. 🎯 완료 버튼 클릭 시 '그룹 이름 설정 페이지(/group/name)'로 이동
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
        top: '83.3px', 
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
            marginTop: '20.7px', 
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
          margin: 0, 
          lineHeight: '30px',
          letterSpacing: '0em',
          textAlign: 'center'
        }}>
          친구 초대하기
        </h1>

        {/* 초대코드 */}
        <div style={{
          marginTop: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: '#000000',
            lineHeight: '22px',
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
          width: '240px',
          height: '240px',
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
            width: '208px',
            height: '208px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
          }}>
            <QRCodeSVG 
              value={shareUrl} 
              size={172} 
              fgColor="#000000"
              bgColor="#ffffff"
              level="M"
            />
          </div>
        </div>

        {/* 하단 공유 & 복사 버튼 영역 */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '36px', 
          width: '100%'
        }}>
          
          {/* 링크 공유 버튼 */}
          <button 
            onClick={handleShare}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px' 
            }}
          >
            <div style={{
              width: '72px',
              height: '72px',
              backgroundColor: '#EDE8FD',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <img 
                src={shareIcon} 
                alt="링크 공유" 
                style={{ width: '36px', height: '36px', objectFit: 'contain' }} 
              />
            </div>
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              color: '#8E8E93',
              whiteSpace: 'nowrap'
            }}>
              링크 공유
            </span>
          </button>

          {/* 링크 복사하기 버튼 */}
          <button 
            onClick={handleCopyLink}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px' 
            }}
          >
            <div style={{
              width: '72px',
              height: '72px',
              backgroundColor: '#EDE8FD',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <img 
                src={linkIcon} 
                alt="링크 복사하기" 
                style={{ width: '36px', height: '36px', objectFit: 'contain' }} 
              />
            </div>
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '16px',
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