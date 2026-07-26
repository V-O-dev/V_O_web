import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import GroupPage from "./pages/GroupPage";
import EditNicknamePage from "./pages/EditNicknamePage";
import AlertPage from "./pages/AlertPage";
import SignupFlow from "./pages/SignupFlow";
import GroupMainPage from "./pages/GroupMainPage";
import GroupThemeSelect from "./pages/GroupThemeSelect";
import GroupExamplesPage from "./pages/GroupExamplesPage";
import GroupThemeCompletePage from "./pages/GroupThemeCompletePage";
import TimePickerPage from "./pages/TimePickerPage";
import GroupCreateCompletePage from "./pages/GroupCreateCompletePage";
import GroupInvitePage from "./pages/GroupInvitePage";
import GroupInviteSharePage from "./pages/GroupInviteSharePage";
import GroupNamePage from "./pages/GroupNamePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 피드 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/edit-nickname/:userId" element={<EditNicknamePage />} />
        <Route path="/alert" element={<AlertPage />} />
        <Route path="/signup" element={<SignupFlow />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;