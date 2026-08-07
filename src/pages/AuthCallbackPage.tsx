import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isProcessed = useRef(false); // React 18 StrictMode 중복 실행 방지 Flag

  useEffect(() => {
    // 이미 처리가 끝났다면 중복 실행 방지
    if (isProcessed.current) return;

    // 1. URL 쿼리 스트링에서 백엔드가 넘겨준 토큰 파싱
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    // 2. 토큰 유효성 검증 및 저장 처리
    if (accessToken && refreshToken) {
      isProcessed.current = true;

      // LocalStorage에 인증 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      navigate('/signup', { replace: true });
    } else {
      // 쿼리 파라미터에 토큰이 누락된 예외 경우
      console.error('로그인 인증 실패: URL 파라미터에 토큰이 존재하지 않습니다.');
      alert('로그인 처리에 실패했습니다. 다시 시도해 주세요.');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100vh',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Manrope, sans-serif'
    }}>
      <p style={{ 
        fontSize: '16px', 
        color: '#7B3FF2', 
        fontWeight: 600,
        margin: 0 
      }}>
        로그인 처리 중입니다...
      </p>
    </div>
  );
}