import { useState, useEffect, useRef } from 'react';
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
  const currentGroupId = useGroupStore((state) => state.currentGroupId); // TODO: 로그인/그룹 연동되면 이 fallback 제거

  // ----- 카메라 권한 안내 모달 관련 상태 -----
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  // 이미 "차단"된 상태라 브라우저가 팝업을 다시 띄워주지 않고 즉시 실패한 경우
  const [permissionBlocked, setPermissionBlocked] = useState(false);
  const permissionStatusRef = useRef<PermissionStatus | null>(null);

  // 시작하기를 누른 이후(chat, camera)에는 뒤로가기/홈 버튼만 숨김 (헤더 바 자체는 유지)
  const showHeaderButtons = phase === 'question' || phase === 'ready';

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
      const timer = setTimeout(() => setShowReadyButton(true), 2000);
      return () => clearTimeout(timer);
    }
    setShowReadyButton(false);
  }, [phase]);

  // 'ready' 단계에 진입하면 카메라 권한 상태를 확인해서, 이미 차단되어 있으면 안내 모달을 띄움.
  // (Permissions API를 지원하는 브라우저에서만 사전 감지가 가능. iOS Safari 등 미지원 브라우저는
  //  사전 감지를 할 수 없어서 이 시점엔 모달이 뜨지 않지만, 아래 버튼 로직 자체는 그대로 동작함)
  useEffect(() => {
    if (phase !== 'ready') return;

    let cancelled = false;

    const checkPermission = async () => {
      if (!navigator.permissions?.query) return;

      try {
        const status = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (cancelled) return;

        permissionStatusRef.current = status;
        setShowPermissionModal(status.state === 'denied');

        status.onchange = () => {
          // 사용자가 브라우저 설정에서 직접 허용/차단을 바꾸면 실시간으로 반영
          setShowPermissionModal(status.state === 'denied');
          if (status.state !== 'denied') setPermissionBlocked(false);
        };
      } catch {
        // 'camera' permission을 지원하지 않는 브라우저 (Safari 등) - 사전 감지 불가, 조용히 넘어감
      }
    };

    checkPermission();

    return () => {
      cancelled = true;
      if (permissionStatusRef.current) permissionStatusRef.current.onchange = null;
    };
  }, [phase]);

  // "카메라 권한 허용하기" 버튼 클릭 시 실제 권한 요청을 트리거
  const handleRequestCameraPermission = async () => {
    setIsRequestingPermission(true);
    setPermissionBlocked(false);
    try {
      // 권한이 아직 "물어본 적 없음" 상태라면 여기서 브라우저 네이티브 팝업이 뜨고,
      // 이미 허용된 상태라면 팝업 없이 바로 성공함.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      // 실제 촬영은 카메라 페이지에서 다시 스트림을 받으므로, 여기서는 확인 후 바로 정지
      stream.getTracks().forEach((track) => track.stop());
      setShowPermissionModal(false);
    } catch {
      // 이미 명시적으로 "차단"된 상태라면 브라우저가 팝업을 다시 띄우지 않고 즉시 실패함.
      // 이건 브라우저 보안 정책이라 JS로 우회할 수 없고, 사용자가 브라우저/시스템 설정에서
      // 직접 허용으로 바꿔야만 함.
      setPermissionBlocked(true);
    } finally {
      setIsRequestingPermission(false);
    }
  };

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
      {/* 상단 헤더 (바는 항상 표시, 뒤로가기/홈 버튼은 question·ready 단계에서만 표시) */}
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
        {showHeaderButtons ? (
          <button
            type="button"
            onClick={() => {
              if (phase === 'question') navigate(-1);
              else if (phase === 'ready') setPhase('question');
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
          >
            {'<'}
          </button>
        ) : (
          <div style={{ width: '20px' }} />
        )}
        <span style={{
          margin: '0 auto',
          fontSize: '16px',
          fontWeight: 700,
          color: '#000000'
        }}>촬영 하기</span>
        {showHeaderButtons ? (
          <button
            type="button"
            onClick={() => navigate('/home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
          >
            <img src="/Home.svg" alt="home" style={{ width: '20px', height: '20px' }} />
          </button>
        ) : (
          <div style={{ width: '20px' }} />
        )}
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
                  questionContent: todayQuestion,
                  answerTimeLimitMs,
                },
              });
            }}
          />
        </div>
      )}

      {/* 카메라 권한 차단 안내 바텀시트 - 'ready' 단계에서 권한이 차단되어 있으면 표시 */}
      {phase === 'ready' && showPermissionModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 15, 15, 0.45)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 200,
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            background: '#ffffff',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            padding: '12px 24px 32px',
            boxSizing: 'border-box',
            animation: 'slideUp 0.25s ease',
          }}>
            {/* 드래그 핸들 */}
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#E5E1F5', margin: '0 auto 20px' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: '28px' }}>
                질문이 나오면<br />바로 답할 수 있게
              </p>
              <span style={{ fontSize: '34px', lineHeight: 1 }}>🔔</span>
            </div>

            <p style={{ fontSize: '13px', color: '#9491A8', margin: '0 0 20px 0', lineHeight: '19px' }}>
              카메라를 켜고 영상을 촬영할 수 있도록 권한을 허용해주세요.
            </p>

            {permissionBlocked && (
              <p style={{ fontSize: '12px', color: '#FF3B30', margin: '0 0 12px 0', lineHeight: '17px' }}>
                이미 차단된 권한이라 자동으로 다시 물어볼 수 없어요. 브라우저 주소창의 카메라 아이콘(또는 사이트 설정)에서 직접 허용한 뒤 다시 시도해주세요.
              </p>
            )}

            <button
              type="button"
              onClick={handleRequestCameraPermission}
              disabled={isRequestingPermission}
              style={{
                width: '100%',
                height: '52px',
                border: 'none',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #7B3FF2 0%, #A855F7 100%)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                cursor: isRequestingPermission ? 'not-allowed' : 'pointer',
                opacity: isRequestingPermission ? 0.7 : 1,
              }}
            >
              {isRequestingPermission ? '확인 중...' : '카메라 권한 허용하기'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}