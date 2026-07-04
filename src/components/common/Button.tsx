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
      // 검은색 테두리를 없애고 완전히 둥글게(Capsule) 만듭니다. 그림자도 확실하게 추가했습니다.
      style={{
        border: 'none',
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        borderRadius: '9999px',
        paddingTop: '16px',
        paddingBottom: '16px',
        width: '100%',
        maxWidth: '280px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.5)',
      }}
      className="transition-all active:scale-[0.98] hover:bg-[#6d28d9]"
    >
      {text}
    </button>
  );
}