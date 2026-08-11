import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { axiosInstance } from '../apis/axiosInstance';

export default function JoinGroupPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL 쿼리 파라미터에서 ?code=XXXXX 추출
  const codeFromUrl = searchParams.get('code') || '';

  const [inviteCode, setInviteCode] = useState(codeFromUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 내부 인라인 토스트 알림 상태
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; subMessage?: string }>({
    isOpen: false,
    message: '',
    subMessage: ''
  });

  const showToast = (message: string, subMessage?: string) => {
    setToast({ isOpen: true, message, subMessage });
    setTimeout(() => {
      setToast({ isOpen: false, message: '', subMessage: '' });
    }, 2500);
  };

  useEffect(() => {
    if (codeFromUrl) {
      setInviteCode(codeFromUrl);
    }
  }, [codeFromUrl]);

  // 백엔드 그룹 참여 API 호출
  const handleJoinGroup = async () => {
    const cleanCode = inviteCode.trim();
    if (!cleanCode) {
      showToast('초대 코드를 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('accessToken');

      const response = await axiosInstance.post(
        '/api/v1/invites/join',
        { inviteCode: cleanCode },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      const resData = response.data?.data;
      const joinedGroupId = resData?.groupId;

      showToast('그룹 참여 완료! 🚀', '홈 화면으로 이동합니다.');

      setTimeout(() => {
        navigate('/home', {
          state: {
            groupId: joinedGroupId,
            inviteCode: cleanCode
          }
        });
      }, 1500);

    } catch (error: any) {
      console.error('그룹 참여 실패:', error.response?.data);
      const serverMsg = error.response?.data?.message || '유효하지 않거나 만료된 초대 코드입니다.';
      showToast('그룹 참여 실패', serverMsg);
    } finally {
      setIsSubmitting(false);
    }
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
      {/* 1. 헤더 */}
      <Header />

      {/* 2. 컨텐츠 영역 */}
      <div style={{
        position: 'absolute',
        top: '95.3px',
        left: '25px',
        width: '310px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '30px',
          color: '#0F0F0F',
          margin: 0
        }}>
          그룹 초대 코드 입력
        </h1>

        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 500,
          fontSize: '13px',
          color: '#9491A8',
          margin: '4px 0 28px 0'
        }}>
          공유받은 초대 코드로 그룹에 참여하세요
        </p>

        {/* 초대 코드 입력창 */}
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          placeholder="초대 코드를 입력하세요"
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            border: '1.5px solid #A870FF',
            padding: '0 16px',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '2px',
            textAlign: 'center',
            boxSizing: 'border-box',
            outline: 'none'
          }}
        />
      </div>

      {/* 3. 하단 참여하기 버튼 */}
      <div style={{
        position: 'absolute',
        bottom: '94px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '310px',
        height: '48px'
      }}>
        <button
          type="button"
          onClick={handleJoinGroup}
          disabled={!inviteCode.trim() || isSubmitting}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: inviteCode.trim() ? '#7B3FF2' : '#C3ACFF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            cursor: inviteCode.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          {isSubmitting ? '참여 처리 중...' : '그룹 참여하기'}
        </button>
      </div>

      {/* 4. 자체 내장 인라인 토스트 UI */}
      {toast.isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '160px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '280px',
          backgroundColor: 'rgba(26, 26, 30, 0.92)',
          borderRadius: '18px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          boxSizing: 'border-box'
        }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            color: '#FFFFFF',
            textAlign: 'center'
          }}>
            {toast.message}
          </span>
          {toast.subMessage && (
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              color: '#A2A0B3',
              textAlign: 'center'
            }}>
              {toast.subMessage}
            </span>
          )}
        </div>
      )}

      {/* 바닥 여백 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />
    </div>
  );
}