import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ProfileStep from './pages/ProfileStep';
import NameStep from './pages/NameStep';
import CompleteStep from './pages/CompleteStep'; 

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profileImg, setProfileImg] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const handleProfileComplete = () => {
    setStep(2);
  };

  const handleBackToProfile = () => {
    setStep(1);
  };

  const handleNameComplete = (name: string) => {
    setUserName(name);
    setStep(3); 
  };

  const handleFinalStart = () => {
    alert(`${userName}님의 가입 처리가 최종 완료되었습니다! 메인 서비스로 이동합니다.`);
  };

  return (
    <BrowserRouter>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '360px',
          minHeight: '100vh',
          margin: '0 auto',
          border: '1px solid #eaeaea',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        {step === 1 && (
          <ProfileStep 
            onNext={handleProfileComplete} 
            onBack={() => window.history.back()}
          />
        )}
        
        {step === 2 && (
          <NameStep 
            onNext={handleNameComplete} 
            onBack={handleBackToProfile} 
          />
        )}

        {step === 3 && (
          <CompleteStep 
            onStart={handleFinalStart} 
            onBack={() => setStep(2)} 
          />
        )}
      </div>
    </BrowserRouter>
  );
}