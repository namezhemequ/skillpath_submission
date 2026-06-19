import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PlanDetailPage } from './pages/PlanDetailPage';
import { AnimationPage } from './pages/AnimationPage';
import { CursorGlow } from './components/CursorGlow';

export default function App() {
  return (
    <BrowserRouter>
      <CursorGlow />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan/:id" element={<PlanDetailPage />} />
        <Route path="/setup" element={<AnimationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
