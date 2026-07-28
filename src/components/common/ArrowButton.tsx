interface ArrowButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export function ArrowButton({ direction, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: '#F7F5FC',
        border: 'none',
        cursor: 'pointer',
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000000',
        fontWeight: 700,
        fontSize: '16px',
      }}
    >
      {direction === 'left' ? '<' : '>'}
    </button>
  );
}