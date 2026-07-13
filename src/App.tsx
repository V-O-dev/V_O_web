import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// 💡 작성하신 페이지 컴포넌트들을 정확하게 불러옵니다.
import GroupMainPage from './pages/GroupMainPage';
import GroupThemeSelect from './pages/GroupThemeSelect';
import GroupExamplesPage from './pages/GroupExamplesPage'; 
import GroupThemeCompletePage from './pages/GroupThemeCompletePage'; // 🎯 4페이지 완료 화면 import 추가!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 첫 화면 */}
        <Route path="/" element={<GroupMainPage />} />
        
        {/* 2. 테마 선택 화면 */}
        <Route path="/group/theme" element={<GroupThemeSelect />} />

        {/* 3. 질문 예시 화면 */}
        <Route path="/group/examples" element={<GroupExamplesPage />} />

        {/* 4. 테마 선택 완료 화면 
            🎯 3페이지에서 navigate('/group/complete')를 호출하면 이 통로로 연결됩니다! */}
        <Route path="/group/complete" element={<GroupThemeCompletePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;