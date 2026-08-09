// 에셋 임포트
import mainLogo from '../assets/main_logo.svg';
import kakaoIcon from '../assets/kakao_icon.svg'; 
import naverIcon from '../assets/naver_icon.svg'; 
import googleIcon from '../assets/google_icon.svg'; 

export default function LoginPage() {
  const BASE_URL = "https://54.206.52.35.nip.io/api/v1/auth/oauth";

  // 🎯 현재 접속한 도메인(localhost 또는 Vercel 주소)을 자동으로 감지
  const REDIRECT_BASE = window.location.origin;

  // 로컬/배포 환경에 따라 redirectUri가 동적으로 변경됨
  const KAKAO_AUTH_URL = `${BASE_URL}/kakao/login?redirectUri=${REDIRECT_BASE}/oauth/kakao`;
  const NAVER_AUTH_URL = `${BASE_URL}/naver/login?redirectUri=${REDIRECT_BASE}/oauth/naver`;
  const GOOGLE_AUTH_URL = `${BASE_URL}/google/login?redirectUri=${REDIRECT_BASE}/oauth/google`;

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const handleNaverLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      width: '360px',
      height: '800px',
      margin: '0 auto',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* 1. 브랜드 로고 */}
      <div style={{
        position: 'absolute',
        top: '190px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '93.6px',
        height: '51px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={mainLogo} 
          alt="V_O 로고" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* 2. 서브 타이틀 */}
      <p style={{
        position: 'absolute',
        top: '258px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '178px',
        height: '60px',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        color: '#000000',
        margin: 0,
        textAlign: 'center',
        lineHeight: '30px',
        letterSpacing: '0px'
      }}>
        매일 10초, 질문으로 열리는<br />
        우리들의 진짜 일상
      </p>

      {/* 3. 소셜 로그인 버튼 영역 */}
      <div style={{
        position: 'absolute',
        bottom: '112px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '312px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>

        {/* 카카오 로그인 */}
        <button
          type="button"
          onClick={handleKakaoLogin}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: '#FEE500',
            border: 'none',
            borderRadius: '12px',
            color: '#000000',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <img src={kakaoIcon} alt="카카오" style={{ width: '18px', height: '18px' }} />
          카카오 로그인
        </button>

        {/* 네이버 로그인 */}
        <button
          type="button"
          onClick={handleNaverLogin}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: '#03CF5D',
            border: 'none',
            borderRadius: '12px',
            color: '#FFFFFF',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <img src={naverIcon} alt="네이버" style={{ width: '16px', height: '16px' }} />
          네이버 로그인
        </button>

        {/* Google로 시작하기 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            color: '#000000',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <img src={googleIcon} alt="구글" style={{ width: '18px', height: '18px' }} />
          Google로 시작하기
        </button>

      </div>

    </div>
  );
}