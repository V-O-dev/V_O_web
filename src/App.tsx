import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/common/Header';

export default function App() {
  // 테스트를 위한 간단한 스텝 상태 (1: 메인 화면, 2: 상세 화면)
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <BrowserRouter>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '360px', // 실제 모바일 규격 뷰 확인용 컨테이너
          minHeight: '100vh',
          margin: '0 auto',
          border: '1px solid #eaeaea',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
        }}
      >
        {/* 🎯 [테스트 포인트] 
            1단계(메인)에서는 화살표를 숨기고, 2단계(상세)에서만 화살표를 노출!
            그리고 화살표를 누르면 1단계로 돌아오도록 커스텀 온백 함수 주입 */}
        <Header 
          showBackButton={step === 2} 
          onBackClick={() => setStep(1)} 
        />

        <main style={{ flex: 1, padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {step === 1 ? (
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0F0F0F' }}>
                여기는 [1단계] 메인 화면입니다
              </h1>
              <p style={{ color: '#666666', marginTop: '12px', fontSize: '14px' }}>
                아래 버튼을 누르면 뒤로가기가 필요한 다음 화면으로 이동해요.
              </p>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  backgroundColor: '#7C3AED',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                다음 단계로 가기
              </button>
            </div>
          ) : (
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0F0F0F' }}>
                여기는 [2단계] 상세 화면입니다 🎉
              </h1>
              <p style={{ color: '#FF383C', marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>
                💡 좌측 상단의 뒤로가기 화살표를 눌러보세요!
              </p>
              <p style={{ color: '#666666', marginTop: '4px', fontSize: '12px' }}>
                커스텀한 onBackClick이 먹혀서 1단계로 쏙 돌아가면 버그 수정 성공!
              </p>
            </div>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}