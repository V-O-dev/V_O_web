import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backArrowIcon from '../assets/back_arrow.svg';
import logoImg from '../assets/logo.png';
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

  // 🎯 1. 다중 펼침을 위해 단일 id가 아닌 배열(Array) 상태로 변경! (기본값으로 1번이 열려있도록 세팅)
  const [expandedIds, setExpandedIds] = useState<number[]>([1]);

  // 2페이지에서 넘겨받은 테마 이름 가져오기
  const themeLabel = location.state?.themeLabel || '선택한';

  // 🎯 2. 여러 개 펴놓을 수 있도록 토글 함수 수정
  const toggleExpand = (id: number) => {
    if (expandedIds.includes(id)) {
      // 이미 열려있으면 배열에서 제거해서 닫기
      setExpandedIds(expandedIds.filter(expandedId => expandedId !== id));
    } else {
      // 닫혀있으면 기존 배열에 새로 클릭한 id를 누적(추가)해서 계속 열어두기
      setExpandedIds([...expandedIds, id]);
    }
  };

  // 최종 완료 페이지로 갈 때 받은 테마명을 그대로 릴레이 토스!
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

      {/* 2. 타이틀 영역 (좌측 시작선 32px) */}
      <div style={{ 
        position: 'absolute',
        top: '149.3px', 
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

      {/* 3. 질문 예시 리스트 영역 (좌측 시작선 20px) */}
      <div style={{
        position: 'absolute',
        top: '203.3px',
        left: '20px', 
        width: '320px', 
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', 
        boxSizing: 'border-box'
      }}>
        {EXAMPLES_DATA.map((item) => {
          // 🎯 3. 배열 안에 현재 카드의 id가 포함되어 있는지로 오픈 여부 체크!
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
              {/* 왼쪽 텍스트 및 아이콘 정렬 뭉치 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}> 
                
                {/* 말풍선 배경 영역 */}
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
                
                {/* 타이틀 & 본문 세로 배치 래퍼 */}
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
                  
                  {/* 펼쳐졌을 때 노출되는 피그마 예시 문구 */}
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
              
              {/* 우측 접고 펼치기 화살표 아이콘 */}
              <img 
                src={isExpanded ? arrowDownIcon : arrowRightIcon} 
                alt="화살표" 
                style={{ width: '20px', height: '20px', flexShrink: 0 }} 
              />
            </div>
          );
        })}
      </div>

      {/* 4. 하단 버튼 영역 (바닥 기준 94px 고정) */}
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