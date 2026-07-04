import React from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function Input({ value, onChange, placeholder = '' }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      // Tailwind가 안 먹힐 때를 대비해 style 속성으로 강제 고정합니다.
      style={{
        border: 'none',
        borderBottom: '4px solid #6366f1',
        backgroundColor: 'transparent',
        textAlign: 'center',
        outline: 'none',
        paddingBottom: '12px',
        width: '100%',
        maxWidth: '260px',
      }}
      className="text-4xl font-black text-gray-950 tracking-wide focus:border-[#4f46e5] transition-colors placeholder-gray-300"
    />
  );
}