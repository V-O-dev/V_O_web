import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: 'none',
        background: 'linear-gradient(90deg, #8040FF 0%, #AA80FF 100%)',
        
        fontFamily: 'Manrope, sans-serif',
        fontSize: '16px',
        fontWeight: 500, 
        color: '#ffffff', 
        
        width: '312px',
        height: '48px',
        borderRadius: '17px', 
        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        
        boxShadow: '0 8px 20px -4px rgba(128, 64, 255, 0.43)',
      }}
      className="transition-all active:scale-[0.98] hover:opacity-95"
    >
      {text}
    </button>
  );
}