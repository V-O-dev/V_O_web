import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';

import completeBadgeImg from '../assets/complete_badge.svg'; 

export default function GroupCreateCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🎯 '계속' 클릭 시 이전 state(groupId, inviteCode 등)를 그대로 보존하여 /group/invite로 이동
  const handleNext = () => {
    navigate('/group/invite', {
      state: {
        ...location.state
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
        top: '183.3px', 
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '320px',
        boxSizing: 'border-box'
      }}>
        
        {/* 완료 배지 이미지 */}
        <img 
          src={completeBadgeImg} 
          alt="그룹 생성 완료 배지" 
          style={{ 
            width: '134px', 
            height: '134px', 
            objectFit: 'contain',
            marginBottom: '20px'
          }} 
        />

        {/* 그룹 생성 완료! 타이틀 */}
        <h1 style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '24px',
          fontWeight: 500,
          color: '#0F0F0F',
          margin: 0,
          marginBottom: '8px',
          lineHeight: '150%',
          textAlign: 'center'
        }}>
          그룹 생성 완료!
        </h1>

        {/* 서브 설명 문구 */}
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: '#989898', 
          margin: 0,
          lineHeight: '150%',
          textAlign: 'center'
        }}>
          이제 다른 사람들에게 그룹을 공유해보세요
        </p>

      </div>

      {/* 3. 하단 버튼 영역 */}
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
        <div style={{ width: '312px' }}>
          <Button 
            text="계속" 
            onClick={handleNext} 
            style={{ width: '312px', height: '48px' }} 
          />
        </div>
      </div>

      {/* 4. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}