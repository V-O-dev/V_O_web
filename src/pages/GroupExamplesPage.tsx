import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';

import speechBubbleIcon from '../assets/speech_bubble.svg'; 
import arrowRightIcon from '../assets/arrow_right.svg'; 
import arrowDownIcon from '../assets/arrow_down.svg';     

interface ExampleItem {
  id: number;
  title: string;
  content: string;
}

const EXAMPLES_DATA: ExampleItem[] = [
  { id: 1, title: '질문 예시 1', content: '좋아하는만큼 10초동안 표현하기' },
  { id: 2, title: '질문 예시 2', content: '서로에게 가장 고마웠던 순간은?' },
  { id: 3, title: '질문 예시 3', content: '상대방의 첫인상은?' },
];

export default function GroupExamplesPage() {
  const navigate = useNavigate();
  const location = useLocation(); 

  // 기본값을 빈 배열([])로 세팅하여 초기 진입 시 모두 닫힌 상태
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const themeLabel = location.state?.themeLabel || '선택한';

  const toggleExpand = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(expandedId => expandedId !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const handleSelectTheme = () => {
    navigate('/group/complete', { state: { themeLabel: themeLabel } });
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
        left: '32px', 
        textAlign: 'left', 
        width: '296px', 
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          fontFamily: 'Manrope, sans-serif',
          fontSize: '20px', 
          fontWeight: 500, 
          color: '#000000', 
          margin: 0, 
          lineHeight: '150%', 
          letterSpacing: '0em' 
        }}>
          질문 예시를 확인해주세요
        </h1>
      </div>

      {/* 3. 질문 예시 리스트 영역 (top: 189.3px -> 149.3px) */}
      <div style={{
        position: 'absolute',
        top: '149.3px',
        left: '20px', 
        width: '320px', 
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', 
        boxSizing: 'border-box'
      }}>
        {EXAMPLES_DATA.map((item) => {
          const isExpanded = expandedIds.includes(item.id);
          return (
            <div 
              key={item.id}
              onClick={() => toggleExpand(item.id)}
              style={{
                width: '320px',
                height: isExpanded ? '80px' : '62px', 
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #8040FF', 
                padding: '10px 20px', 
                boxSizing: 'border-box',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'space-between',
                transition: 'all 0.15s ease-in-out',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
              }}
            >
              {/* 왼쪽 텍스트 및 아이콘 영역 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}> 
                
                {/* 말풍선 아이콘 래퍼 */}
                <div style={{
                  width: '40px',   
                  height: '40px',  
                  borderRadius: '50%',
                  backgroundColor: '#EAE2FF', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px', 
                  boxSizing: 'border-box',
                  flexShrink: 0
                }}>
                  <img src={speechBubbleIcon} alt="말풍선" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                
                {/* 타이틀 & 본문 */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  gap: isExpanded ? '2px' : '0px'
                }}>
                  <span style={{ 
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '16px', 
                    fontWeight: 500, 
                    color: '#000000',
                    lineHeight: '24px'
                  }}>
                    {item.title}
                  </span>
                  
                  {/* 클릭하여 펼쳐졌을 때만 질문 내용 노출 */}
                  {isExpanded && (
                    <p style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#989898', 
                      margin: 0,
                      lineHeight: '20px',
                      wordBreak: 'keep-all'
                    }}>
                      {item.content}
                    </p>
                  )}
                </div>

              </div>
              
              {/* 우측 접기/펼치기 화살표 아이콘 */}
              <img 
                src={isExpanded ? arrowDownIcon : arrowRightIcon} 
                alt="화살표" 
                style={{ width: '20px', height: '20px', flexShrink: 0 }} 
              />
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
        <div style={{ width: '312px' }}>
          <Button 
            text="테마 선택하기" 
            onClick={handleSelectTheme} 
            style={{ width: '312px', height: '48px' }} 
          />
        </div>
      </div>

      {/* 5. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}