import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashPage from '@/pages/SplashPage';
import QuestionPage from '@/pages/QuestionPage';
import CameraPage from '@/pages/CameraPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;