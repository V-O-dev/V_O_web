interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export function Button({ text, style, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
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
        ...style,          // 페이지에서 넘긴 style로 덮어쓰기 가능하게
      }}
      className="transition-all active:scale-[0.98] hover:opacity-95"
      {...rest}            // onClick, type, disabled 등 나머지 다 전달
    >
      {text}
    </button>
  );
}