import { useNavigate } from 'react-router-dom';
import backArrowIcon from '../../assets/back_arrow.svg';
import logoImg from '../../assets/logo.png';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void; // 🎯 외부에서 커스텀 뒤로가기 이벤트를 받을 수 있도록 프롭 추가
}

export function Header({ title, showBackButton = true, onBackClick }: HeaderProps) {
  const navigate = useNavigate();

  // 🎯 커스텀 함수가 들어오면 그걸 실행하고, 없으면 기존처럼 브라우저 뒤로가기(navigate(-1))를 실행
  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '43.3px', 
        padding: '0 16px',
        borderBottom: '1px solid rgba(178, 178, 178, 0.3)',
        boxSizing: 'border-box',
        position: 'relative',
        backgroundColor: '#ffffff',
        flexShrink: 0,
      }}
    >
      {showBackButton && (
        <button
          type="button"
          onClick={handleBack} // 🎯 수정된 핸들러 연결
          style={{
            position: 'absolute',
            left: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            padding: 0,
          }}
        >
          <img
            src={backArrowIcon}
            alt="뒤로가기"
            style={{ width: '12px', height: '20px', objectFit: 'contain' }}
          />
        </button>
      )}

      {title ? (
        <span
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#111111',
            letterSpacing: '-0.3px',
          }}
        >
          {title}
        </span>
      ) : (
        <img
          src={logoImg}
          alt="V_O 로고"
          style={{ height: '18px', width: 'auto', objectFit: 'contain' }}
        />
      )}
    </header>
  );
}