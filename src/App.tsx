import React, { useState } from 'react';
import { Input } from './components/common/Input';
import { Button } from './components/common/Button';
import { BottomSheet } from './components/common/BottomSheet'; 

export default function App() {
  const [name, setName] = useState('홍길동');
  const [isSheetOpen, setIsSheetOpen] = useState(false); 

  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
    
      <h2>컴포넌트 UI 테스트</h2>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      
      <div style={{ marginTop: '20px' }}>
        <Button text="계속" onClick={() => setIsSheetOpen(true)} />
      </div>

      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            {name} 님이 맞으신가요?
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            입력하신 이름으로 세팅을 마무리합니다.
          </p>
          <Button text="확인 완료" onClick={() => setIsSheetOpen(false)} />
        </div>
      </BottomSheet>

    </div>
  );
}