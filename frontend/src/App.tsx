import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import AttendancePage from './pages/AttendancePage';
import { Toast } from './components/Toast';

function AppContent() {
  const { toast, hideToast } = useAttendance();

  return (
    <>
      <Routes>
        <Route path="/" element={<AttendancePage />} />
      </Routes>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AttendanceProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AppContent />
      </BrowserRouter>
    </AttendanceProvider>
  );
}

export default App;