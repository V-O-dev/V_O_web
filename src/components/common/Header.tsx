import React from 'react';
import { useNavigate } from 'react-router-dom';
import backArrowIcon from '/src/assets/back_arrow.svg'; 
import logoImg from '/src/assets/logo.png'; 

interface HeaderProps {
  showBackButton?: boolean;
  title?: string; 
}

export function Header({ showBackButton = true, title }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'absolute',
      top: '40px', 
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
      width: '360px', 
      height: '43.3px', 
      boxSizing: 'border-box',
      padding: '4px 20px 12px 20px', 
      borderBottom: '1px solid rgba(178, 178, 178, 0.5)',
      backgroundColor: '#ffffff',
      zIndex: 10
    }}>
      
      {showBackButton && (
        <button 
          onClick={() => navigate(-1)} 
          style={{
            position: 'absolute', 
            left: '20px',    
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
            style={{ 
              width: '11.95px', 
              height: '19.35px',
              display: 'block'
            }} 
          />
        </button>
      )}

      {title ? (
        <h1 style={{ 
          fontFamily: 'Manrope, sans-serif',
          fontSize: '20px', 
          fontWeight: 500, 
          color: '#000000', 
          margin: 0, 
          lineHeight: '150%', 
          letterSpacing: '0em'
        }}>
          {title}
        </h1>
      ) : (
        <div style={{
          position: 'relative',
          width: '42.6px',  
          height: '21.3px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src={logoImg} 
            alt="V_O 로고" 
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'contain' 
            }} 
          />
        </div>
      )}

    </header>
  );
}