import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import PublicLayout from "./component/common/layout/PublicLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register"; 
import Login from "./pages/Login"; 
import DashboardRoute from "./component/common/DashboardRoute";
import DashboardHome from "./pages/dashboard/DashboardHome";
import InstructorSchedule from "./pages/dashboard/InstructorSchedule";
import InstructorStudents from "./pages/dashboard/InstructorStudents";
import AdminRoute from "./component/common/AdminRoute";
import Courses from "./pages/Courses";

const AdminCourses = () => <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">إدارة الكورسات</div>;
const AdminInstructors = () => <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">إدارة المدرسين</div>;
const AdminStudents = () => <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">إدارة الطلاب</div>;
const AdminSettings = () => <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">إعدادات النظام</div>;

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/courses" element={<Courses />} />
            </Route> 

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<DashboardRoute />}>
              <Route index element={<DashboardHome />} />
              <Route path="courses" element={<div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">الكورسات</div>} />
              <Route path="students" element={<InstructorStudents />} />
              <Route path="schedule" element={<InstructorSchedule />} />
            </Route>

            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<DashboardHome />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="instructors" element={<AdminInstructors />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
