import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileStep from './ProfileStep';
import NameStep from './NameStep';
import CompleteStep from './CompleteStep';
import { useAuthStore } from '../stores/useAuthStore';

export default function SignupFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userName, setUserName] = useState<string>('');

  // 스토어 함수 및 상태 가져오기
  const { signupProgress, login, clearSignupProgress } = useAuthStore();

  const handleProfileComplete = () => setStep(2);
  const handleBackToProfile = () => setStep(1);
  const handleNameComplete = (name: string) => {
    setUserName(name);
    setStep(3);
  };

  // 🎯 최종 시작하기 버튼 클릭 시 동작
  const handleFinalStart = () => {
    // 1. 소셜 로그인 시 미리 저장되어 있던 토큰 가져오기
    const token = localStorage.getItem('accessToken') || '';
    const refreshToken = localStorage.getItem('refreshToken') || undefined;

    // 2. Zustand authStore의 login 함수를 호출하여 임시 가입 정보 -> 정식 유저 정보로 변환
    login(
      {
        phoneNumber: signupProgress.phoneNumber || '',
        nickname: userName || signupProgress.nickname || '사용자',
        profileImageUrl: signupProgress.profileImage || undefined,
      },
      token,
      refreshToken
    );

    // 3. 임시 회원가입 진행 단계 초기화
    clearSignupProgress();

    // 🎯 4. GroupMainPage로 이동 (프로젝트의 실제 라우트 경로로 맞추어 사용하세요)
    navigate('/group/create'); 
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '360px',
        minHeight: '100%',
        margin: '0 auto',
        border: '1px solid #eaeaea',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
      }}
    >
      {step === 1 && (
        <ProfileStep onNext={handleProfileComplete} onBack={() => window.history.back()} />
      )}
      {step === 2 && (
        <NameStep onNext={handleNameComplete} onBack={handleBackToProfile} />
      )}
      {step === 3 && (
        <CompleteStep onStart={handleFinalStart} onBack={() => setStep(2)} />
      )}
    </div>
  );
}