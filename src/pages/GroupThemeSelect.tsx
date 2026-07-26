import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
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
    
    const currentTheme = THEME_DATA.find(t => t.id === selectedTheme);
    navigate('/group/examples', { state: { themeLabel: currentTheme?.label } });
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
      
      {/* 1. 헤더 영역 */}
      <Header />

      {/* 2. 타이틀 영역 (top: 135.3px -> 95.3px) */}
      <div style={{ 
        position: 'absolute',
        top: '95.3px', 
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

      {/* 3. 테마 카드 2x2 그리드 영역 (top: 212.3px -> 172.3px) */}
      <div style={{ 
        position: 'absolute',
        top: '172.3px', 
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
                position: 'relative',
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
              {isSelected && (
                <img 
                  src={checkIcon} 
                  alt="선택됨" 
                  style={{
                    position: 'absolute',
                    bottom: '2px',  
                    right: '2px',   
                    width: '24px',  
                    height: '24px',  
                    zIndex: 2,
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

      {/* 4. 하단 버튼 영역 (위치 고정) */}
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

      {/* 5. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}