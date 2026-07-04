import React, { useState } from 'react';
import { Input } from './components/common/Input';
import { Button } from './components/common/Button';

export default function App() {
  const [name, setName] = useState('홍길동');

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'sans-serif'
      }}
    >
      {/* 중앙 카드 컨테이너 */}
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* 1. 상단 타이틀 */}
        <h2 
          style={{ 
            fontSize: '24px', 
            fontWeight: '900', 
            color: '#111827', 
            margin: '0 0 48px 0',
            letterSpacing: '-0.05em'
          }}
        >
          초기 세팅 오류 해결 완료! 🎉
        </h2>

        {/* 2. 중앙 인풋 컴포넌트 */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>

        {/* 3. 하단 버튼 컴포넌트 */}
        <Button 
          text="계속" 
          onClick={() => console.log('제출된 이름:', name)} 
        />
        
      </div>
    </div>
  );
}