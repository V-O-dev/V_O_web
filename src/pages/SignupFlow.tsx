import { useState } from 'react';
import ProfileStep from './ProfileStep';
import NameStep from './NameStep';
import CompleteStep from './CompleteStep';

export default function SignupFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userName, setUserName] = useState<string>('');

  const handleProfileComplete = () => setStep(2);
  const handleBackToProfile = () => setStep(1);
  const handleNameComplete = (name: string) => {
    setUserName(name);
    setStep(3);
  };
  const handleFinalStart = () => {
    alert(`${userName}님의 가입 처리가 최종 완료되었습니다! 메인 서비스로 이동합니다.`);
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