import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import GroupPage from "./pages/GroupPage";
import EditNicknamePage from "./pages/EditNicknamePage";
import AlertPage from "./pages/AlertPage";
import SignupFlow from "./pages/SignupFlow";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/edit-nickname/:userId" element={<EditNicknamePage />} />
        <Route path="/alert" element={<AlertPage />} />
        <Route path="/signup" element={<SignupFlow />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;