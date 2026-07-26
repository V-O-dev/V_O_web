import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';

import completeBadgeImg from '../assets/complete_badge.svg'; 

export default function GroupThemeCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedThemeLabel = location.state?.themeLabel || '선택한';

  const handleNext = () => {
    navigate('/group/time-picker', { state: { themeLabel: selectedThemeLabel } });
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
    }}>
      
      {/* 1. 헤더 영역 (공통 컴포넌트) */}
      <Header />

      {/* 2. 중앙 컨텐츠 전체 정렬 박스 */}
      <div style={{
        position: 'absolute',
        top: '183.3px', // 🎯 배지(134px) + 여백(20px) 포함하여 타이틀 Y위치가 정확히 337.3px에 위치함
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '320px',
        boxSizing: 'border-box'
      }}>
        
        {/* 완료 배지 이미지 (134px) */}
        <img 
          src={completeBadgeImg} 
          alt="완료 배지" 
          style={{ 
            width: '134px', 
            height: '134px', 
            objectFit: 'contain',
            marginBottom: '20px' // 배지와 타이틀 사이 간격 20px
          }} 
        />

        {/* 🎯 메인 타이틀 (상단 Y축 위치 337.3px 달성) */}
        <h1 style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '24px',
          fontWeight: 500,
          color: '#000000',
          margin: '0 0 8px 0', // 타이틀과 아래 서브문구 간격
          lineHeight: '36px',
          textAlign: 'center'
        }}>
          테마가 선택되었어요!
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
          <span style={{ color: '#DB2777' }}>{selectedThemeLabel}</span> 테마로 그룹이 시작됩니다
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