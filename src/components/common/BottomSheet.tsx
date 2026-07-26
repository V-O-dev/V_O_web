import React from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 9999,
      }}
    >
      <div
        onClick={onClose} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', 
          backdropFilter: 'blur(4px)', 
          WebkitBackdropFilter: 'blur(4px)', 
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '24px', 
          borderTopRightRadius: '24px',
          padding: '32px 24px 40px 24px',
          boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.1)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: '#e5e7eb',
            borderRadius: '2px',
            margin: '0 auto 24px auto',
          }}
        />

        {children}
      </div>
    </div>
  );
}