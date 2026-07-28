import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';


type Phase = 'question' | 'ready' | 'chat' | 'camera';

export default function QuestionPage() {
  const [phase, setPhase] = useState<Phase>('question');
  const [chatOpacity, setChatOpacity] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (phase === 'chat') {
      // 1초 페이드인
      setTimeout(() => setChatOpacity(1), 50);
      // 1초 유지 후 페이드아웃
      setTimeout(() => setChatOpacity(0), 1100);
      // 카메라 화면으로
      setTimeout(() => setPhase('camera'), 2200);
    }
  }, [phase]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '0 24px',
    }}>
      {/* 상단 헤더 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid #ddd3d3',
      }}>
        <button
          type="button"
          onClick={() => {
            if (phase === 'question') navigate(-1);
            else if (phase === 'ready') setPhase('question');
            else if (phase === 'chat') setPhase('ready');
            else if (phase === 'camera') setPhase('ready');
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
        >
          {'<'}
        </button>
        <span style={{
          margin: '0 auto',
          fontSize: '16px',
          fontWeight: 700,
          color: '#000000'
        }}>촬영 하기</span>
      </div>

      {/* 오늘의 질문은? */}
      {phase === 'question' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.5s ease',
        }}>
          <p style={{ fontSize: '22px', fontWeight: 600 }}>오늘의 질문은?</p>
        </div>
      )}

      {/* 촬영 할 준비가 됐나요? */}
      {phase === 'ready' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.5s ease',
        }}>
          <p style={{ fontSize: '22px', fontWeight: 600 }}>촬영 할 준비가 됐나요?</p>
        </div>
      )}

      {/* 말풍선 페이드인/아웃 */}
      {phase === 'chat' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          opacity: chatOpacity,
          transition: 'opacity 1s ease',
        }}>
          <img src="/Chat.png" alt="chat" style={{ width: '120px' }} />
          <p style={{ fontSize: '22px', fontWeight: 600 }}>오늘의 질문</p>
        </div>
      )}

      {/* 카메라 화면 */}
      {phase === 'camera' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          animation: 'fadeIn 0.5s ease',
        }}>
          <img src="/Camera.png" alt="camera" style={{ width: '200px' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>지금 카메라 켜진 상태 그대로!</p>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>눈 깜빡이지 말고 10초 동안 버텨보기!</p>
          </div>
        </div>
      )}

      {/* 다음 버튼 */}
      {phase === 'question' && (
        <div style={{ position: 'absolute', bottom: '48px' }}>
          <Button text="다음" onClick={() => setPhase('ready')} />
        </div>
      )}

      {/* 시작하기 버튼 */}
      {phase === 'ready' && (
        <div style={{ position: 'absolute', bottom: '48px', animation: 'fadeIn 0.5s ease' }}>
          <Button text="시작하기" onClick={() => setPhase('chat')} />
        </div>
      )}

      {/* 준비됐어요 버튼 */}
      {phase === 'camera' && (
        <div style={{ position: 'absolute', bottom: '48px', animation: 'fadeIn 0.5s ease' }}>
          <Button text="준비됐어요!" onClick={() => navigate('/camera')} />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}