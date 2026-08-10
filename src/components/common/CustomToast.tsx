import React, { useEffect } from 'react';

interface CustomToastProps {
  isOpen: boolean;
  message: string;
  subMessage?: string;
  onClose: () => void;
  duration?: number;
}

export const CustomToast: React.FC<CustomToastProps> = ({
  isOpen,
  message,
  subMessage,
  onClose,
  duration = 2500
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '160px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '300px',
      backgroundColor: 'rgba(26, 26, 30, 0.92)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '14px 18px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
      <span style={{
        fontFamily: 'Manrope, sans-serif',
        fontWeight: 600,
        fontSize: '14px',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: '20px'
      }}>
        {message}
      </span>
      {subMessage && (
        <span style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 400,
          fontSize: '12px',
          color: '#A2A0B3',
          textAlign: 'center',
          wordBreak: 'break-all'
        }}>
          {subMessage}
        </span>
      )}
    </div>
  );
};