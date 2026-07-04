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
      style={{
        border: 'none',
        borderBottom: '4px solid #6366f1',
        backgroundColor: 'transparent',
        textAlign: 'center',
        outline: 'none',
        paddingBottom: '16px', 
        width: '100%',
        maxWidth: '340px',    
        fontSize: '36px',      
        fontWeight: '900',     
        color: '#111827',
      }}
      className="transition-colors focus:border-[#4f46e5] placeholder-gray-300"
    />
  );
}