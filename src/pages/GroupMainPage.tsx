import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button'; 
import groupIntroImg from '../assets/group_intro_illustration.png'; 
import logoImg from '../assets/logo.png';
import backArrowIcon from '../assets/back_arrow.svg'; 

export default function GroupMainPage() {
  const navigate = useNavigate();
  const handleCreateGroup = () => {
    navigate('/group/theme'); 
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      width: '100%',
      maxWidth: '360px', 
      height: '800px',   // 피그마 전체 높이 800 고정
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
          onClick={() => console.log('메인화면이므로 뒤로가기 기본 동작 제외')}
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

      {/* 2. 일러스트 영역 */}
      <div style={{
        position: 'absolute',
        top: '185px', 
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <img 
          src={groupIntroImg} 
          alt="그룹 생성 안내 일러스트" 
          style={{ 
            width: '100%',
            maxWidth: '220.3px', 
            height: '227.23px', 
            objectFit: 'contain'
          }}
        />
      </div>

      {/* 3. 대타이틀 영역 */}
      <div style={{ 
        position: 'absolute',
        top: '449.5px', 
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center', 
        fontFamily: 'Manrope, sans-serif', 
        width: '312px', 
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 500, 
          color: '#000000', 
          margin: 0, 
          lineHeight: '37px', 
          letterSpacing: '0px',
          wordBreak: 'keep-all' 
        }}>
          그룹을 <span style={{ color: '#8040FF', fontWeight: 700 }}>생성</span>해보세요!
        </h1>
      </div>

      {/* 4. 소설명 문구 영역 */}
      <div style={{
        position: 'absolute',
        top: '506.5px', 
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center', 
        fontFamily: 'Manrope, sans-serif', 
        width: '312px', 
        boxSizing: 'border-box'
      }}>
        <p style={{ 
          fontSize: '16px', 
          fontWeight: 400, 
          color: '#4B5563', 
          margin: 0, 
          lineHeight: '25px', 
          letterSpacing: '0px',
          wordBreak: 'keep-all'
        }}>
          소중한 사람들과 함께 질문을 주고 받아보세요
        </p>
      </div>

      {/* 🎯 5. 하단 버튼 영역 (바닥 기준 94px 고정으로 피그마 탑 658px 자동 매칭) */}
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
          <Button text="+ 그룹 만들기" onClick={handleCreateGroup} style={{ width: '312px', height: '48px' }} />
        </div>
      </div>

      {/* 6. 바닥 여백 영역 (피그마 총 하단 마진 94px 확보선) */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}