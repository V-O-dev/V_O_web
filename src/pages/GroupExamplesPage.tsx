import { useState } from 'react';
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

// 🎯 테마별 질문 예시 데이터
const THEME_EXAMPLES: Record<string, ExampleItem[]> = {
  FRIEND: [
    { id: 1, title: '질문 예시 1', content: '10초 안에 본인 장점 3개 말하기!' },
    { id: 2, title: '질문 예시 2', content: '지금 당장 제일 먹고 싶은 메뉴는?' },
    { id: 3, title: '질문 예시 3', content: '본인 패션 센스는 10점 만점에 몇 점?' },
  ],
  COUPLE: [
    { id: 1, title: '질문 예시 1', content: '우리 둘이 자주 쓰는 전용 애칭 3개는?' },
    { id: 2, title: '질문 예시 2', content: '애인이 제일 좋아할 만한 표정 짓기!' },
    { id: 3, title: '질문 예시 3', content: '최근 같이 먹은 음식 중 제일 맛있었던 메뉴는?' },
  ],
  FAMILY: [
    { id: 1, title: '질문 예시 1', content: "'우리 가족 사랑해'라고 크게 3번 외치기!" },
    { id: 2, title: '질문 예시 2', content: '가족들 때문에 속상했던 기억이 있나요?' },
    { id: 3, title: '질문 예시 3', content: '다 같이 가보고 싶은 여행지는 어디인가요?' },
  ],
  RANDOM: [
    { id: 1, title: '질문 예시 1', content: '10초 동안 자기소개를 해본다면?' },
    { id: 2, title: '질문 예시 2', content: '오늘의 TMI를 10초 동안 표현한다면?' },
    { id: 3, title: '질문 예시 3', content: '올해가 지나기 전에 이루고 싶은 목표는?' },
  ],
};

export default function GroupExamplesPage() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  // 1. 이전 스텝에서 전달된 값 확인
  const rawTheme = location.state?.themeCode || location.state?.themeLabel || location.state?.theme || '';

  // 2. 한글 라벨이나 대소문자 혼용이 들어와도 정확히 FRIEND / COUPLE / FAMILY / RANDOM으로 매핑
  const getThemeCode = (val: string): string => {
    const str = String(val).toUpperCase();
    if (str.includes('COUPLE') || str.includes('연인') || str.includes('애인') || str.includes('커플')) return 'COUPLE';
    if (str.includes('FAMILY') || str.includes('가족')) return 'FAMILY';
    if (str.includes('RANDOM') || str.includes('랜덤')) return 'RANDOM';
    return 'FRIEND'; // 기본값
  };

  const currentThemeCode = getThemeCode(rawTheme);
  const themeLabel = location.state?.themeLabel || '선택한';

  // 3. 해당 테마 질문 데이터 선택
  const examplesData = THEME_EXAMPLES[currentThemeCode];

  const toggleExpand = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(expandedId => expandedId !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const handleSelectTheme = () => {
    navigate('/group/complete', { 
      state: { 
        ...location.state,
        themeCode: currentThemeCode,
        themeLabel 
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
      
      {/* 1. 헤더 영역 */}
      <Header />

      {/* 2. 타이틀 영역 */}
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

      {/* 3. 질문 예시 리스트 영역 */}
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
        {examplesData.map((item) => {
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

      {/* 4. 하단 버튼 영역 */}
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