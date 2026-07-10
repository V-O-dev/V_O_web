import React, { useMemo } from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  minWidth?: number | string; 
  paddingRight?: number; 
}

export function Input({
  value,
  onChange,
  placeholder = '',
  minWidth = 100, 
  paddingRight = 10, 
}: InputProps) {
  const textWidth = useMemo(() => {
    const charWidths: { [key: string]: number } = {
      default: 0.5,
      '가-힣': 1,
      'A-Z': 0.7,
      '0-9': 0.6,
    };

    let totalWidthMultiplier = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      let widthMultiplier = charWidths.default;
      for (const pattern in charWidths) {
        if (pattern !== 'default' && new RegExp(`[${pattern}]`).test(char)) {
          widthMultiplier = charWidths[pattern];
          break;
        }
      }
      totalWidthMultiplier += widthMultiplier;
    }

    return totalWidthMultiplier;
  }, [value]);

  const fontSize = 32; 
  const computedTextWidth = textWidth * fontSize;
  const inputWidth = computedTextWidth + paddingRight;
  const finalInputWidth = Math.max(inputWidth, Number(minWidth));

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        border: 'none',
        paddingBottom: '10px',
        borderBottom: '2px solid #7E49E9',
        backgroundColor: 'transparent',
        textAlign: 'center',
        outline: 'none',
        width: `${finalInputWidth}px`,
        maxWidth: '340px',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '32px',                 
        fontWeight: '600',                
        color: '#0F0F0F',                 
      }}
      className="transition-colors focus:border-[#7E49E9] placeholder-gray-300"
    />
  );
}