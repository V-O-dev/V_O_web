import { useNavigate } from 'react-router-dom';

// 에셋 임포트
import mainLogo from '../assets/main_logo.svg';
import startCharacter from '../assets/start_character.png';
import alarmIcon from '../assets/alarm_icon.svg';
import chatIcon from '../assets/speech_bubble.svg';

export default function StartPage() {
  const navigate = useNavigate();

  const handleStart = () => {
     navigate('/login');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      // 🎯 피그마 명세에 따른 선형 그라데이션 배경 적용 (0%: #F8F5FA, 100%: #F6F1F8)
      background: 'linear-gradient(180deg, #F8F5FA 0%, #F6F1F8 100%)',
      width: '360px',
      height: '800px',
      margin: '0 auto',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* 1. 브랜드 로고 이미지 (top: 61px) */}
      <div style={{
        position: 'absolute',
        top: '61px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '156px',
        height: '85px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={mainLogo} 
          alt="v_O 브랜드 로고" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      </div>

      {/* 2. 메인 서브 타이틀 (top: 178px) */}
      <p style={{
        position: 'absolute',
        top: '178px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        color: '#000000',
        margin: 0,
        textAlign: 'center',
        lineHeight: '30px',
        width: '172px',
        height: '60px'
      }}>
        매일 10초,<br />
        질문으로 열리는 진짜 기록
      </p>

      {/* 3. 칩 1: X 63, Y 277 */}
      <div style={{
        position: 'absolute',
        left: '63px',
        top: '277px',
        width: '190px',
        height: '35px',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        boxShadow: '0px 4px 12px rgba(126, 73, 233, 0.08)',
        boxSizing: 'border-box'
      }}>
        <img src={alarmIcon} alt="시계" style={{ width: '20px', height: '20px' }} />
        <span style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: '#000000',
          lineHeight: '30px',
          letterSpacing: '0px'
        }}>
          지금 10초동안 촬영하기
        </span>
      </div>

      {/* 4. 칩 2: X 119, Y 325 */}
      <div style={{
        position: 'absolute',
        left: '119px',
        top: '325px',
        width: '190px',
        height: '35px',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        boxShadow: '0px 4px 12px rgba(126, 73, 233, 0.08)',
        boxSizing: 'border-box'
      }}>
        {/* 🎯 speech_bubble 크기 확대 (기존 14px -> 18px) */}
        <img src={chatIcon} alt="말풍선" style={{ width: '20px', height: '20px' }} />
        <span style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: '#000000',
          lineHeight: '30px',
          letterSpacing: '0px'
        }}>
          오늘의 질문을 확인해보세요!
        </span>
      </div>

      {/* 5. 캐릭터 그래픽 영역 (Y 378px) */}
      <div style={{
        position: 'absolute',
        top: '378px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '240px',
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}>
        <img 
          src={startCharacter} 
          alt="v_O 캐릭터" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* 🎯 5-1. 피그마 명세 기반 캐릭터 발 밑 타원형 그림자 추가 */}
      <div style={{
        position: 'absolute',
        top: '565px', // 캐릭터 바로 발 밑 위치에 맞춰 조정
        left: '53%',
        transform: 'translateX(-50%)',
        width: '80px',
        height: '8px',
        backgroundColor: '#7B3FF2',
        borderRadius: '50%',
        filter: 'blur(10px)', // 피그마 '레이어 흐림' 효과
        opacity: 0.8,
        zIndex: 1
      }} />

      {/* 6. 하단 시작하기 버튼 (바닥에서 94px) */}
      <div style={{
        position: 'absolute',
        bottom: '94px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '312px',
        height: '48px',
        boxSizing: 'border-box',
        zIndex: 3
      }}>
        <button
          type="button"
          onClick={handleStart}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            border: 'none',
            borderRadius: '16px',
            color: '#FFFFFF',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          시작하기
        </button>
      </div>

    </div>
  );
}