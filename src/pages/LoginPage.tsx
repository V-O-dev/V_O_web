import React from 'react';
import { useNavigate } from 'react-router-dom';

// 에셋 임포트
import mainLogo from '../assets/main_logo.svg';
import kakaoIcon from '../assets/kakao_icon.svg'; 
import naverIcon from '../assets/naver_icon.svg'; 
import googleIcon from '../assets/google_icon.svg'; 

export default function LoginPage() {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    navigate('/signup'); 
  };

  const handleNaverLogin = () => {
    navigate('/signup');
  };

  const handleGoogleLogin = () => {
    navigate('/signup');
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

      {/* 1. 브랜드 로고 (크기: 93.6 x 51) */}
      <div style={{
        position: 'absolute',
        top: '190px', // 🎯 보정된 최상단 Y 좌표
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
          alt="v_O 로고" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* 2. 서브 타이틀 (로고 밑 17px -> top: 258px) */}
      <p style={{
        position: 'absolute',
        top: '258px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '178px',
        height: '60px',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '16px',
        fontWeight: 400, // 🎯 Regular
        color: '#000000',
        margin: 0,
        textAlign: 'center',
        lineHeight: '30px', // 🎯 행간 30px
        letterSpacing: '0px' // 🎯 자간 0%
      }}>
        매일 10초, 질문으로 열리는<br />
        우리들의 진짜 일상
      </p>

      {/* 3. 소셜 로그인 버튼 영역 (서브타이틀 밑 120px, 하단 여백 112px 고정) */}
      <div style={{
        position: 'absolute',
        bottom: '112px', // 🎯 [수정] 피그마 하단 간격 112px
        left: '50%',
        transform: 'translateX(-50%)',
        width: '312px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px' // 🎯 [수정] 버튼 간격 12px
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