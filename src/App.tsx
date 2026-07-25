import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GroupMainPage from './pages/GroupMainPage'; // 🎯 1. 첫 화면 메인
import GroupThemeSelect from './pages/GroupThemeSelect';
import GroupExamplesPage from './pages/GroupExamplesPage'; 
import GroupThemeCompletePage from './pages/GroupThemeCompletePage';
import TimePickerPage from './pages/TimePickerPage'; 
import GroupCreateCompletePage from './pages/GroupCreateCompletePage';
import GroupInvitePage from './pages/GroupInvitePage';
import GroupInviteSharePage from './pages/GroupInviteSharePage'; // 🎯 2. 그룹 초대 단계
import GroupNamePage from './pages/GroupNamePage'; // 🎯 3. 그룹 초대 완료 후 이동할 페이지!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🎯 1. 시작 페이지 */}
        <Route path="/" element={<GroupMainPage />} />

        {/* 그룹 관련 작업 진행 순서 */}
        <Route path="/group/theme" element={<GroupThemeSelect />} />
        <Route path="/group/examples" element={<GroupExamplesPage />} />
        <Route path="/group/complete" element={<GroupThemeCompletePage />} />
        <Route path="/group/time-picker" element={<TimePickerPage />} />
        <Route path="/group/create-complete" element={<GroupCreateCompletePage />} />
        <Route path="/group/invite" element={<GroupInvitePage />} />
        <Route path="/group/invite-share" element={<GroupInviteSharePage />} />

        {/* 🎯 4. 초대 완료 후에 넘어오는 그룹 이름/사진 설정 페이지 */}
        <Route path="/group/name" element={<GroupNamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;