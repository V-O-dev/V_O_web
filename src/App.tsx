import { BrowserRouter, Routes, Route } from "react-router-dom";

// 시작 페이지 추가
import StartPage from "./pages/StartPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import GroupPage from "./pages/GroupPage";
import EditNicknamePage from "./pages/EditNicknamePage";
import AlertPage from "./pages/AlertPage";

// 회원가입 단계별 스텝 페이지
import ProfileStep from "./pages/ProfileStep";
import NameStep from "./pages/NameStep";
import CompleteStep from "./pages/CompleteStep";

import GroupMainPage from "./pages/GroupMainPage";
import GroupThemeSelect from "./pages/GroupThemeSelect";
import GroupExamplesPage from "./pages/GroupExamplesPage";
import GroupThemeCompletePage from "./pages/GroupThemeCompletePage";
import TimePickerPage from "./pages/TimePickerPage";
import GroupCreateCompletePage from "./pages/GroupCreateCompletePage";
import GroupInvitePage from "./pages/GroupInvitePage";
import GroupInviteSharePage from "./pages/GroupInviteSharePage";
import GroupNamePage from "./pages/GroupNamePage";
import SplashPage from "./pages/SplashPage";
import QuestionPage from "./pages/QuestionPage";
import CameraPage from "./pages/CameraPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 앱 시작 페이지 (기본 진입점) */}
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />


        {/* 회원가입 플로우 (단계별 독립 경로 연결) */}
        <Route path="/signup" element={<ProfileStep />} />
        <Route path="/signup/profile" element={<ProfileStep />} />
        <Route path="/signup/name" element={<NameStep />} />
        <Route path="/signup/complete" element={<CompleteStep />} />

        {/* 그룹 생성 플로우 */}
        <Route path="/group/create" element={<GroupMainPage />} />
        <Route path="/group/theme" element={<GroupThemeSelect />} />
        <Route path="/group/examples" element={<GroupExamplesPage />} />
        <Route path="/group/complete" element={<GroupThemeCompletePage />} />
        <Route path="/group/time-picker" element={<TimePickerPage />} />
        <Route path="/group/create-complete" element={<GroupCreateCompletePage />} />
        <Route path="/group/invite" element={<GroupInvitePage />} />
        <Route path="/group/invite-share" element={<GroupInviteSharePage />} />
        <Route path="/group/name" element={<GroupNamePage />} />

         {/* 메인 피드 */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/edit-nickname/:userId" element={<EditNicknamePage />} />
        <Route path="/alert" element={<AlertPage />} />

        {/* 촬영/나의 달력 */}
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;