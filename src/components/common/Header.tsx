import { useNavigate } from 'react-router-dom';
import backArrowIcon from '../../assets/back_arrow.svg';
import logoImg from '../../assets/logo.png';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function Header({ title, showBackButton = true }: HeaderProps) {
  const navigate = useNavigate();

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
          onClick={() => navigate(-1)}
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