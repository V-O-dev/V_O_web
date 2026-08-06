import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosInstance } from '@/apis/axiosInstance';
import { useGroupStore } from '@/stores/useGroupStore';


type Phase = 'question' | 'ready' | 'chat' | 'camera';

export default function QuestionPage() {
  const [phase, setPhase] = useState<Phase>('question');
  const [chatOpacity, setChatOpacity] = useState(0);
  const [todayQuestion, setTodayQuestion] = useState<string>('');
  const [todayQuestionId, setTodayQuestionId] = useState<number | null>(null);
  const [answerTimeLimitMs, setAnswerTimeLimitMs] = useState<number>(10000); // 스웨거 기본 예시값
  const [showReadyButton, setShowReadyButton] = useState(false);
  const navigate = useNavigate();
  const currentGroupId = useGroupStore((state) => state.currentGroupId) ?? 12; // TODO: 로그인/그룹 연동되면 이 fallback 제거

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

  // camera 화면이 뜨고 3초 후에 "준비됐어요!" 버튼 표시
  useEffect(() => {
    if (phase === 'camera') {
      setShowReadyButton(false);
      const timer = setTimeout(() => setShowReadyButton(true), 3000);
      return () => clearTimeout(timer);
    }
    setShowReadyButton(false);
  }, [phase]);

  // 오늘의 질문을 백엔드에서 가져오기
  useEffect(() => {
    console.log('[DEBUG] currentGroupId:', currentGroupId); // 임시 디버그 로그

    if (!currentGroupId) {
      console.log('[DEBUG] groupId가 없어서 API 요청을 보내지 않음'); // 임시 디버그 로그
      return;
    }

    const fetchTodayQuestion = async () => {
      try {
        const res = await axiosInstance.get('/api/v1/questions/daily', {
          params: { groupId: Number(currentGroupId) },
        });

        console.log('[DEBUG] API 응답 전체:', res.data); // 임시 디버그 로그

        if (res.data.success) {
          setTodayQuestion(res.data.data.content);
          setTodayQuestionId(res.data.data.questionId);
          setAnswerTimeLimitMs(res.data.data.answerTimeLimitMs ?? 10000);
        } else {
          setTodayQuestion(res.data.message || '오늘의 질문을 불러오지 못했어요');
          setTodayQuestionId(null);
        }
      } catch (error) {
        console.error('[DEBUG] API 요청 에러:', error); // 임시 디버그 로그

        // axios 에러(4xx, 5xx)인 경우 서버가 내려준 실제 메시지를 사용
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setTodayQuestion(error.response.data.message);
        } else {
          setTodayQuestion('오늘의 질문을 불러오지 못했어요');
        }
        setTodayQuestionId(null);
      }
    };

    fetchTodayQuestion();
  }, [currentGroupId]);

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
        <button
          type="button"
          onClick={() => navigate('/home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          <img src="/Home.svg" alt="home" style={{ width: '20px', height: '20px' }} />
        </button>
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
            <p style={{ fontSize: '14px', color: '#888' }}>지금 카메라 켜진 상태 그대로!</p>
            <p style={{ fontSize: '24px', fontWeight: 700, marginTop: '8px', whiteSpace: 'pre-line' }}>{todayQuestion}</p>
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

      {/* 준비됐어요 버튼 (camera 화면 진입 3초 후 표시) */}
      {phase === 'camera' && showReadyButton && (
        <div style={{ position: 'absolute', bottom: '48px', animation: 'fadeIn 0.5s ease' }}>
          <Button
            text="준비됐어요!"
            onClick={() => {
              if (todayQuestionId == null) {
                alert('오늘의 질문 정보를 아직 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
                return;
              }
              navigate('/camera', {
                state: {
                  groupId: Number(currentGroupId),
                  questionId: todayQuestionId,
                  answerTimeLimitMs,
                },
              });
            }}
          />
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
