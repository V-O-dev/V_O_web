import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button'; 
import groupIntroImg from '../assets/group_intro_illustration.png'; 

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
      height: '800px',   
      margin: '0 auto',  
      boxSizing: 'border-box',
      position: 'relative', 
    }}>
      
      {/* 1. 헤더 영역 (공통 컴포넌트) */}
      <Header />

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
        top: '463px', 
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
          그룹을 <span style={{ color: '#7E49E9', fontWeight: 700 }}>생성</span>해보세요!
        </h1>
      </div>

      {/* 4. 소설명 문구 영역 (방법 1: 16px 피그마 스펙 유지 + 자간 조절로 1줄 고정) */}
      <div style={{
        position: 'absolute',
        top: '513px', 
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center', 
        fontFamily: 'Manrope, sans-serif', 
        width: '296px',
        boxSizing: 'border-box'
      }}>
        <p style={{ 
          fontSize: '16px',       
          fontWeight: 400,    
          color: '#989898',   
          margin: 0, 
          lineHeight: '20px', 
          letterSpacing: '-0.5px', // 미세 자간 조절로 2줄 넘침 방지
          whiteSpace: 'nowrap'     // 한 줄 정렬 고정
        }}>
          소중한 사람들과 함께 질문을 주고 받아보세요
        </p>
      </div>

      {/* 5. 하단 버튼 영역 */}
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
          <Button text="그룹 만들기" onClick={handleCreateGroup} style={{ width: '312px', height: '48px' }} />
        </div>
      </div>

      {/* 6. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}