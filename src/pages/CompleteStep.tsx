import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import completeBadge from '../assets/complete_badge.svg'; 

interface CompleteStepProps {
  onStart: () => void;
  onBack: () => void; // 🎯 뒤로가기 함수 타입 추가
}

export default function CompleteStep({ onStart, onBack }: CompleteStepProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. 상단 공통 헤더: 뒤로가기 버튼 활성화 및 핸들러 연결 */}
      <Header showBackButton={true} onBackClick={onBack} />

      {/* 2. 메인 콘텐츠 영역 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
        {/* 체크 뱃지 이미지 (Margin Top 109px, 크기 134x134) */}
        <div style={{ marginTop: '109px', width: '134px', height: '134px' }}>
          <img
            src={completeBadge}
            alt="가입 완료 뱃지"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* 타이틀 영역: Margin Top 20px */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '24px',
              fontWeight: 500,
              color: '#0F0F0F',
              margin: 0,
              lineHeight: 1.5,
              letterSpacing: '0px',
              whiteSpace: 'nowrap',
            }}
          >
            환영합니다!
          </h1>
        </div>

        {/* 서브 타이틀 영역: Margin Top 29px */}
        <div style={{ marginTop: '29px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#989898',
              margin: 0,
              lineHeight: 1.5,
              letterSpacing: '0px',
              whiteSpace: 'nowrap',
            }}
          >
            V_O 회원가입 및 인증이 모두 완료되었습니다
          </p>
        </div>

        {/* 시작하기 버튼 영역: Margin Top 243.7px */}
        <div
          style={{
            marginTop: '243.7px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '52px',
          }}
        >
          <div style={{ width: '312px', height: '48px' }}>
            <Button type="button" onClick={onStart} text="계속">
              <span
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  lineHeight: '22.5px',
                }}
              >
                계속
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}