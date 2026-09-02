import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const ROLES = [
  { key: "applicant", label: "المتقدم", description: "شخص قدم على وظيفة" },
  { key: "technical_manager", label: "مدير تقني", description: "إدارة الأقسام التقنية" },
  { key: "track_head", label: "رئيس مسار", description: "قيادة مسار تعليمي" },
  { key: "academic_reviewer", label: "مراجع أكاديمي", description: "مراجعة المحتوى الأكاديمي" },
  { key: "ops_planner", label: "مخطط عمليات", description: "التخطيط التشغيلي" },
  { key: "quality_reviewer", label: "مراجع جودة", description: "مراجعة جودة المحتوى" },
  { key: "admin", label: "المشرف العام", description: "إدارة النظام بالكامل" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingApplication, setPendingApplication] = useState(null);
  
  // 👇 إضافة State للتحكم في البوب اب
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // دوال تسجيل الدخول والتسجيل (كما هي)
  const login = (email, password, role = "student") => {
    setUser({
      name: email.split("@")[0],
      email,
      role,
    });
  };

 const register = (name, email, password, phone, idNumber, role = "applicant") => {
  setUser({
    name,
    email,
    phone,
    idNumber,
    role,
  });
};

  const logout = () => {
    setUser(null);
    setPendingApplication(null);
  };

  // 👇 دوال فتح وقفل البوب اب (الجديد)
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value = {
    user,
    role: user?.role || "guest",
    isAuthenticated: Boolean(user),
    pendingApplication,
    setPendingApplication,
    setUser,
    login,
    register,
    logout,
    // 👇 نضيف الدوال الجديدة هنا عشان تكون متاحة لكل المكونات
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth يجب أن يُستخدم داخل AuthProvider");
  return ctx;
}