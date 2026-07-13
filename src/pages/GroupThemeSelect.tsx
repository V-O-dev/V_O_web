import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import backArrowIcon from '../assets/back_arrow.svg'; 
import logoImg from '../assets/logo.png';
import { Button } from '../components/common/Button'; 

import themeFriendImg from '../assets/theme_friend.png'; 
import themeCoupleImg from '../assets/theme_couple.png'; 
import themeFamilyImg from '../assets/theme_family.png'; 
import themeRandomImg from '../assets/theme_random.png'; 
import checkIcon from '../assets/check_icon.png';

const THEME_DATA = [
  { id: 'friend', label: '친구', image: themeFriendImg },
  { id: 'couple', label: '연인', image: themeCoupleImg },
  { id: 'family', label: '가족', image: themeFamilyImg },
  { id: 'random', label: '랜덤', image: themeRandomImg },
];

export default function GroupThemeSelect() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleSelectCard = (id: string) => {
    setSelectedTheme(id); 
  };

const handleShowExamples = () => {
  if (!selectedTheme) return;
  
  // 현재 선택된 id('friend', 'couple' 등)를 가지고 THEME_DATA에서 한글 라벨('친구', '연인' 등)을 찾음
  const currentTheme = THEME_DATA.find(t => t.id === selectedTheme);
  
  // 3페이지로 이동하면서 선택한 테마 라벨을 state로 넘겨줌
  navigate('/group/examples', { state: { themeLabel: currentTheme?.label } });
};

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
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

      {/* 2. 타이틀 영역 (좌측 여백 32.5px 고정) */}
      <div style={{ 
        position: 'absolute',
        top: '149.3px', 
        left: '32.5px', 
        textAlign: 'left', 
        width: '292px', 
        boxSizing: 'border-box'
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', margin: '0 0 8px 0', lineHeight: '30px', letterSpacing: '0em' }}>
          그룹 테마를 선택해주세요
        </h1>
        <p style={{ fontSize: '14px', fontWeight: 400, color: '#989898', margin: 0, lineHeight: '21px', letterSpacing: '0em', wordBreak: 'keep-all' }}>
          질문의 예시를 보고 테마를 선택해주세요
        </p>
      </div>

      {/* 3. 테마 카드 2x2 그리드 영역 */}
      <div style={{ 
        position: 'absolute',
        top: '232.3px', 
        left: '32.5px', 
        display: 'grid',
        gridTemplateColumns: '136px 136px', 
        columnGap: '20px', 
        rowGap: '20px',    
        width: '292px', 
        boxSizing: 'border-box',
      }}>
        {THEME_DATA.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <div 
              key={theme.id}
              onClick={() => handleSelectCard(theme.id)}
              style={{
                position: 'relative', // 🎯 [핵심] 체크 아이콘의 기준점이 되도록 relative 추가!
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between', 
                backgroundColor: '#ffffff',
                width: '136px',  
                height: '170px', 
                padding: '18px',
                borderRadius: '10.8px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                border: isSelected ? '2px solid #8040FF' : '1px solid #E5E7EB',
                boxShadow: isSelected 
                  ? '0 10px 25px rgba(128, 64, 255, 0.3)' 
                  : '0 10px 20px rgba(0, 0, 0, 0.12)', 
                transition: 'all 0.15s ease-in-out',
              }}
            >
              {/* 🎯 [핵심] 선택되었을 때만 우측 상단에 체크 아이콘 렌더링 */}
              {isSelected && (
                <img 
                  src={checkIcon} 
                  alt="선택됨" 
                  style={{
                    position: 'absolute',
                    top: '12px',   // 위에서 12px 떨어짐 (피그마 캡처본 느낌의 여백)
                    right: '12px', // 오른쪽에서 12px 떨어짐
                    width: '22px', // 아이콘 크기 (필요시 피그마 스펙에 맞춰 조절해!)
                    height: '22px',
                    zIndex: 2,     // 다른 일러스트보다 위에 오도록
                  }}
                />
              )}

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <img src={theme.image} alt={`${theme.label} 일러스트`} style={{ width: '100%', height: 'auto', maxHeight: '85px', objectFit: 'contain' }} />
              </div>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontWeight: 600, color: isSelected ? '#8040FF' : '#0F0F0F', lineHeight: '24px', letterSpacing: '0em', textAlign: 'center', width: '100%', marginTop: '9px' }}>
                {theme.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* 🎯 4. 하단 버튼 영역 (1페이지와 완벽 동기화 - 바닥 기준 94px 고정) */}
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
        <div style={{ width: '312px', opacity: selectedTheme ? 1 : 0.5, pointerEvents: selectedTheme ? 'auto' : 'none', transition: 'all 0.2s ease-in-out' }}>
          <Button 
            text="질문 예시보기" 
            onClick={handleShowExamples} 
            style={{ width: '312px', height: '48px' }} 
          />
        </div>
      </div>

      {/* 5. 바닥 여백 영역 (피그마 총 하단 마진 94px 확보선) */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}