import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* الموقع الرئيسي */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/courses" element={<Courses />} />
            </Route>

            {/* صفحات_auth منفصلة */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staff-login" element={<StaffLogin />} />

            {/* صفحة الوظائف — مستقلة تماماً */}
            <Route path="/jobs" element={<JobsLayout />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
