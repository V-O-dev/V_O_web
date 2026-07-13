import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backArrowIcon from '../assets/back_arrow.svg';
import logoImg from '../assets/logo.png';
import { Button } from '../components/common/Button';

import completeBadgeImg from '../assets/complete_badge.svg'; 

export default function GroupThemeCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🎯 2페이지 -> 3페이지 -> 4페이지로 이어진 선택한 진짜 테마 라벨을 최종 수신!
  const selectedThemeLabel = location.state?.themeLabel || '선택한';

  const handleReset = () => {
    navigate('/group/theme');
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
      
      {/* 1. 헤더 영역 */}
      <header style={{
        position: 'absolute',
        top: '54px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '312px', 
        height: '43.3px', 
        boxSizing: 'border-box',
        padding: '4px 0 12px 0',
        borderBottom: '1px solid rgba(178, 178, 178, 0.5)' 
      }}>
        <button 
          onClick={() => window.history.back()} 
          style={{
            position: 'absolute', 
            left: '0', 
            background: 'none', 
            border: 'none',
            cursor: 'pointer', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',  
            height: '24px', 
            padding: 0
          }}
        >
          <img src={backArrowIcon} alt="뒤로가기" style={{ width: '11.95px', height: '19.35px' }} />
        </button>
        <img src={logoImg} alt="v_o 로고" style={{ height: '18px', width: 'auto', objectFit: 'contain' }} />
      </header>

      {/* 2. 중앙 컨텐츠 전체 정렬 박스 (상하간격 실측 유지) */}
      <div style={{
        position: 'absolute',
        top: '197.3px', 
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
          alt="완료 배지" 
          style={{ 
            width: '134px', 
            height: '134px', 
            objectFit: 'contain',
            marginBottom: '20px' 
          }} 
        />

        {/* 메인 타이틀 */}
        <h1 style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '24px',
          fontWeight: 500,
          color: '#000000',
          margin: '0 0 20px 0', 
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
          {/* 🎯 동적으로 넘겨받은 테마명이 핑크색으로 매핑됨 */}
          <span style={{ color: '#DB2777' }}>{selectedThemeLabel}</span>테마로 그룹이 시작됩니다
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
            onClick={handleReset} 
            style={{ width: '312px', height: '48px' }} 
          />
        </div>
      </div>

      {/* 4. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}