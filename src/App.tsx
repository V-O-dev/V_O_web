import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom'; // 🎯 라우터 환경 주입을 위해 추가!
import { Input } from './components/common/Input';
import { Button } from './components/common/Button';
import { BottomSheet } from './components/common/BottomSheet'; 
import { Header } from './components/common/Header'; 

export default function App() {
  const [name, setName] = useState('홍길동');
  const [isSheetOpen, setIsSheetOpen] = useState(false); 

  return (
    // 🎯 useNavigate 에러를 해결하기 위해 전체를 BrowserRouter로 감싸줌!
    <BrowserRouter>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '360px', 
        height: '800px',   
        margin: '0 auto',  
        boxSizing: 'border-box',
        position: 'relative', 
        border: '1px solid #eaeaea', 
      }}>
        
        <Header />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: '100%',
          padding: '24px',
          boxSizing: 'border-box',
          marginTop: '83.3px' 
        }}>
          
          <h2 style={{ marginBottom: '40px', fontFamily: 'sans-serif' }}>
            컴포넌트 UI 테스트
          </h2>
          
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          
          <div style={{ marginTop: '50px' }}>
            <Button text="계속" onClick={() => setIsSheetOpen(true)} />
          </div>

          <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 0'
            }}>
              <h3 style={{ 
                fontFamily: 'Manrope, sans-serif',
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#0F0F0F',
                margin: '0 0 12px 0' 
              }}>
                {name} 님이 맞으신가요?
              </h3>
              <p style={{ 
                fontFamily: 'Manrope, sans-serif',
                color: '#6b7280', 
                fontSize: '15px',
                margin: '0 0 32px 0' 
              }}>
                입력하신 이름으로 세팅을 마무리합니다.
              </p>
              <Button text="확인 완료" onClick={() => setIsSheetOpen(false)} />
            </div>
          </BottomSheet>

        </div>
      </div>
    </BrowserRouter>
  );
}