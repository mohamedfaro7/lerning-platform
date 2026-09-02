import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  KeyIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import Input from "../../component/common/Input";
import Button from "../../component/common/Button";

export default function JobsAuthScreen() {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  // التبويب النشط (تسجيل دخول هو الافتراضي)
  const [activeTab, setActiveTab] = useState("login");

  // نموذج التسجيل
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
  });

  // نموذج تسجيل الدخول
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // دوال التغيير
  const handleRegisterChange = (e) => {
    setRegisterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLoginChange = (e) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // إنشاء حساب
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    if (registerForm.password.length < 8) {
      setError("كلمة المرور يجب أن تكون ٨ أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      await register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
        registerForm.phone,
        registerForm.idNumber,
        "applicant"
      );
      navigate("/jobs", { replace: true, state: { openApply: true } });
    } catch (err) {
      setError("حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginForm.email || !loginForm.password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password, "applicant");
      navigate("/jobs", { replace: true, state: { openApply: true } });
    } catch (err) {
      setError("بيانات الدخول غير صحيحة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[80vh] items-center justify-center px-6 py-16"
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-8 shadow-lg backdrop-blur-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* الهيدر - مطابق للصورة */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--accent)", opacity: 0.12 }}
          >
            <UserIcon className="h-8 w-8" style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            مرحباً بك
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            سجل دخولك أو أنشئ حساباً جديداً
          </p>
        </div>

        {/* التبويبات (تسجيل دخول / إنشاء حساب) */}
        <div className="mb-6 flex rounded-xl border p-1" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              activeTab === "login"
                ? "text-white shadow-md"
                : "hover:bg-[var(--surface-hover)]"
            }`}
            style={{
              backgroundColor: activeTab === "login" ? "var(--accent)" : "transparent",
              color: activeTab === "login" ? "#fff" : "var(--text-secondary)",
            }}
          >
            تسجيل دخول
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              activeTab === "register"
                ? "text-white shadow-md"
                : "hover:bg-[var(--surface-hover)]"
            }`}
            style={{
              backgroundColor: activeTab === "register" ? "var(--accent)" : "transparent",
              color: activeTab === "register" ? "#fff" : "var(--text-secondary)",
            }}
          >
            إنشاء حساب
          </button>
        </div>

        {/* عرض الأخطاء */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600"
            >
              ❌ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* نموذج تسجيل الدخول */}
        <AnimatePresence mode="wait">
          {activeTab === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {loading ? (
                  <span className="animate-pulse">جاري تسجيل الدخول...</span>
                ) : (
                  <>
                    <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                    تسجيل دخول
                  </>
                )}
              </Button>

              <div className="mt-2 text-center">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  ليس لديك حساب؟{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="font-medium transition-all hover:underline"
                    style={{ color: "var(--accent)" }}
                  >
                    أنشئ حساباً الآن
                  </button>
                </p>
              </div>
            </motion.form>
          )}

          {/* نموذج إنشاء حساب (بجميع الحقول) */}
          {activeTab === "register" && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRegister}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  رقم الجوال <span className="text-red-500">*</span>
                </label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={registerForm.phone}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  رقم البطاقة الشخصية <span className="text-red-500">*</span>
                </label>
                <Input
                  name="idNumber"
                  type="text"
                  placeholder="أدخل رقم بطاقتك"
                  value={registerForm.idNumber}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  كلمة المرور (8 أحرف على الأقل) <span className="text-red-500">*</span>
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="٨ أحرف على الأقل"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  تأكيد كلمة المرور <span className="text-red-500">*</span>
                </label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="أعد كتابة كلمة المرور"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {loading ? (
                  <span className="animate-pulse">جاري إنشاء الحساب...</span>
                ) : (
                  <>
                    إنشاء حساب
                    <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="mt-2 text-center">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  لديك حساب بالفعل؟{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="font-medium transition-all hover:underline"
                    style={{ color: "var(--accent)" }}
                  >
                    سجل دخولك هنا
                  </button>
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}