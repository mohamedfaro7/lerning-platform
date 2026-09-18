import { createContext, useContext, useState, useEffect } from "react";

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
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("auth_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const savedApps = localStorage.getItem("auth_applications");
      return savedApps ? JSON.parse(savedApps) : [];
    } catch {
      return [];
    }
  });

  const [pendingApplication, setPendingApplication] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // مزامنة البيانات مع localStorage عند التغيير
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem("auth_applications", JSON.stringify(applications));
    } else {
      localStorage.removeItem("auth_applications");
    }
  }, [applications]);

  // ========== Auth Functions ==========
  const login = (email, password, role = "student", phone = "", idNumber = "") => {
    const newUser = {
      name: email.split("@")[0],
      email,
      role,
      phone,
      idNumber,
    };
    setUser(newUser);
  };

  const register = (name, email, password, phone = "", idNumber = "", role = "student") => {
    const newUser = {
      name,
      email,
      phone,
      idNumber,
      role,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setPendingApplication(null);
    setApplications([]);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_applications");
  };

  // ========== Application Management ==========
  const addApplication = (jobRole) => {
    const newApp = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      jobRole,
      status: "in-progress",
      currentStep: 0,
      appliedAt: new Date().toISOString(),
      steps: [
        { id: 1, status: "active", date: new Date().toISOString() },
        { id: 2, status: "pending", date: "" },
        { id: 3, status: "pending", date: "" },
        { id: 4, status: "pending", date: "" },
        { id: 5, status: "pending", date: "" },
        { id: 6, status: "pending", date: "" },
      ],
      rejectionReason: "",
      aiAnalysis: {
        score: 87,
        strengths: ["خبرة React (4 سنوات)", "المهارات القيادية"],
        weaknesses: ["ضعف في DevOps"],
        matchPercentage: 87,
      },
    };

    setApplications((prev) => [...prev, newApp]);
    return newApp.id;
  };

  const updateApplicationStatus = (appId, newStatus, reason = "", stepIndex = null) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        let updatedSteps = [...app.steps];
        let currentStep = stepIndex ?? app.currentStep;

        if (newStatus === "accepted") {
          updatedSteps = updatedSteps.map((s) => ({
            ...s,
            status: "completed",
            date: s.date || new Date().toISOString(),
          }));
        } else if (newStatus === "rejected") {
          updatedSteps = updatedSteps.map((s, i) => {
            if (i < currentStep) return { ...s, status: "completed" };
            if (i === currentStep) return { ...s, status: "rejected", date: new Date().toISOString() };
            return { ...s, status: "pending" };
          });
        } else if (stepIndex !== null) {
          updatedSteps = updatedSteps.map((s, i) => ({
            ...s,
            status: i < stepIndex ? "completed" : i === stepIndex ? "active" : "pending",
            date: i <= stepIndex ? s.date || new Date().toISOString() : "",
          }));
        }

        return {
          ...app,
          status: newStatus,
          currentStep,
          rejectionReason: reason || app.rejectionReason,
          steps: updatedSteps,
        };
      })
    );
  };

  const getApplicationById = (appId) => {
    return applications.find((app) => app.id === appId) || null;
  };

  // ========== Modal Controls ==========
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
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    applications,
    addApplication,
    updateApplicationStatus,
    getApplicationById,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}