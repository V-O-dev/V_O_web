import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/common/Header';

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <Header showBackButton={false} />

        <main style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>v_o 웹앱 프로젝트가 시작되었습니다!</h1>
          <p style={{ color: '#666666', marginTop: '8px' }}>
            src/App.tsx 파일을 수정하여 페이지 개발을 시작해 주세요.
          </p>
        </main>
      </div>
    </BrowserRouter>
  );
}