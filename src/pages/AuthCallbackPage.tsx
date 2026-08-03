// src/pages/AuthCallbackPage.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. URL 쿼리 스트링에서 백엔드가 전달해 준 값 추출
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const isNewUser = searchParams.get('isNewUser');

    if (accessToken) {
      // 2. 브라우저 저장소(localStorage)에 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // 3. 신규 회원 / 기존 회원 조건부 이동
      if (isNewUser === 'true') {
        navigate('/signup'); // 신규 회원은 프로필 설정으로
      } else {
        navigate('/home');   // 기존 회원은 메인 피드로 바로 이동!
      }
    } else {
      // 토큰을 정상 수신하지 못한 경우 로그인 화면으로 복귀
      console.error('토큰 정보를 찾을 수 없습니다.');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Manrope, sans-serif'
    }}>
      <p style={{ fontSize: '16px', color: '#0F0F0F', fontWeight: 500 }}>
        로그인 처리 중입니다...
      </p>
    </div>
  );
}