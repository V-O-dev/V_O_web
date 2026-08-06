import { forwardRef, useMemo } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minWidth?: number | string;
  paddingRight?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { value, onChange, placeholder = '', minWidth = 40, paddingRight = 16, style, ...rest },
  ref
) {
  // 🎯 외부 style에서 fontSize가 넘어오면 사용하고, 없으면 기본 32px 사용
  const parsedFontSize = useMemo(() => {
    if (style?.fontSize) {
      return typeof style.fontSize === 'number'
        ? style.fontSize
        : parseInt(String(style.fontSize), 10) || 32;
    }
    return 32;
  }, [style?.fontSize]);

  const textWidth = useMemo(() => {
    // 🎯 문자별 너비 배율 조정
    const charWidths: { [key: string]: number } = {
      default: 0.5,
      'ㄱ-ㅎ': 0.85,  // 🌟 낱자 자음 (밑줄 길이를 더 여유 있게 고정/확장)
      'ㅏ-ㅣ': 0.75,  // 🌟 낱자 모음
      '가-힣': 0.72,  // 🌟 완성형 한글 (기존 1.0 -> 0.72로 줄여서 과하게 길어지는 것 방지)
      'A-Z': 0.65,
      'a-z': 0.55,
      '0-9': 0.55,
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

  const computedTextWidth = textWidth * parsedFontSize;
  const inputWidth = computedTextWidth + paddingRight;
  const finalInputWidth = Math.max(inputWidth, Number(minWidth) || 40);

  // 🎯 external style의 width가 계산된 width를 덮어쓰지 않도록 분리
  const { width, ...restStyle } = style || {};

  return (
    <input
      ref={ref}
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
        fontFamily: 'Manrope, sans-serif',
        fontSize: `${parsedFontSize}px`,
        fontWeight: '600',
        color: '#0F0F0F',
        ...restStyle,
        width: `${finalInputWidth}px`, // 🎯 동적 계산 너비를 최우선 반영
        maxWidth: '340px',
      }}
      className="transition-all focus:border-[#7E49E9] placeholder-gray-300"
      {...rest}
    />
  );
});