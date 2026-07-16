import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GroupMainPage from './pages/GroupMainPage';
import GroupThemeSelect from './pages/GroupThemeSelect';
import GroupExamplesPage from './pages/GroupExamplesPage'; 
import GroupThemeCompletePage from './pages/GroupThemeCompletePage';
import TimePickerPage from './pages/TimePickerPage'; 
import GroupCreateCompletePage from './pages/GroupCreateCompletePage';
import GroupInvitePage from './pages/GroupInvitePage'; // 🎯 라우트 import 추가!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GroupMainPage />} />
        <Route path="/group/theme" element={<GroupThemeSelect />} />
        <Route path="/group/examples" element={<GroupExamplesPage />} />
        <Route path="/group/complete" element={<GroupThemeCompletePage />} />
        <Route path="/group/time" element={<TimePickerPage />} />
        <Route path="/group/create-complete" element={<GroupCreateCompletePage />} />
        
        {/* 🎯 7. 그룹 생성 후 초대코드/QR코드 확인 화면 */}
        <Route path="/group/invite" element={<GroupInvitePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;