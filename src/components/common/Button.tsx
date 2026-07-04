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
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        borderRadius: '9999px',
        paddingTop: '18px',
        paddingBottom: '18px',
        width: '100%',
        maxWidth: '340px',    
        cursor: 'pointer',
        fontSize: '20px',      
        fontWeight: 'bold',
        boxShadow: '0 12px 28px -4px rgba(124, 58, 237, 0.45)',
      }}
      className="transition-all active:scale-[0.98] hover:bg-[#6d28d9]"
    >
      {text}
    </button>
  );
}