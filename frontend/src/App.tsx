import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AttendanceProvider } from './context/AttendanceContext';
import AttendancePage from './pages/AttendancePage';

function App() {
  return (
    <AttendanceProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<AttendancePage />} />
        </Routes>
      </BrowserRouter>
    </AttendanceProvider>
  );
}

export default App;