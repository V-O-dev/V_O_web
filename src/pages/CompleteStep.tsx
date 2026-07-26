import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import completeBadge from '../assets/complete_badge.svg'; 

interface CompleteStepProps {
  onStart?: () => void;
  onBack?: () => void;
}

export default function CompleteStep({ onStart, onBack }: CompleteStepProps) {
  const navigate = useNavigate();

  // 버튼 클릭 시 이동 핸들러
  const handleStartSubmit = () => {
    if (onStart) {
      onStart();
    } else {
      navigate('/group/create');
    }
  };

  // 뒤로가기 클릭 시 핸들러
  const handleBackSubmit = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      width: '100%',
      maxWidth: '360px', 
      height: '800px',   
      margin: '0 auto',  
      boxSizing: 'border-box',
      position: 'relative', 
      overflow: 'hidden'
    }}>
      
      {/* 1. 헤더 영역 (공통 컴포넌트) */}
      <Header showBackButton={true} onBackClick={handleBackSubmit} />

      {/* 2. 가입 완료 뱃지 영역 */}
      <div style={{
        position: 'absolute',
        top: '185px', 
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '134px',
        height: '134px',
        boxSizing: 'border-box'
      }}>
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

      {/* 3. 환영 메시지 (대타이틀) */}
      <div style={{ 
        position: 'absolute',
        top: '339px', 
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center', 
        fontFamily: 'Manrope, sans-serif', 
        width: '312px', 
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 500, 
          color: '#0F0F0F', 
          margin: 0, 
          lineHeight: '36px', 
          letterSpacing: '0px',
          whiteSpace: 'nowrap'
        }}>
          환영합니다!
        </h1>
      </div>

      {/* 4. 완료 서브설명 문구 */}
      <div style={{
        position: 'absolute',
        top: '387px', 
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center', 
        fontFamily: 'Manrope, sans-serif', 
        width: '312px',
        boxSizing: 'border-box'
      }}>
        <p style={{ 
          fontSize: '14px',       
          fontWeight: 400,    
          color: '#989898',   
          margin: 0, 
          lineHeight: '21px', 
          letterSpacing: '0px',
          whiteSpace: 'nowrap'
        }}>
          V_O 회원가입 및 인증이 모두 완료되었습니다
        </p>
      </div>

      {/* 5. 하단 버튼 영역 */}
      <div style={{
        position: 'absolute',
        bottom: '94px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '312px',
        height: '48px', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        <div style={{ width: '312px' }}>
          <Button 
            text="계속" 
            onClick={handleStartSubmit} 
            style={{ width: '312px', height: '48px' }} 
          />
        </div>
      </div>

      {/* 6. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}