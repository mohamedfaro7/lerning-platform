import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import PublicLayout from "./component/common/layout/PublicLayout";
import JobsLayout from "./component/common/layout/JobsLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StaffLogin from "./pages/StaffLogin";
import Courses from "./pages/Courses";
import AuthModal from "./component/common/AuthModal";
import JobsAuthScreen from "./pages/jobs/JobsAuthScreen";
import ApplicationTracker from "./pages/jobs/ApplicationTracker";

function AppContent() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<Courses />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/jobs/register" element={<JobsAuthScreen />} />
        <Route path="/jobs" element={<JobsLayout />} />
        <Route path="/track/:applicationId" element={<ApplicationTracker />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}