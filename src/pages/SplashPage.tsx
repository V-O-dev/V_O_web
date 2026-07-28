import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const [showQuestion, setShowQuestion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQuestion(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showQuestion) {
      const timer = setTimeout(() => {
        navigate('/question');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [showQuestion]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: showQuestion ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.6s ease',
      }}>
        <img src="/logo.png" alt="V_O" style={{ width: '120px' }} />
      </div>
    </div>
  );
}