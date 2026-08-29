import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, UserIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import Input from "./Input";
import Button from "./Button";

export default function AuthModal({ isOpen, onClose }) {
  // ١. جلب دوال تسجيل الدخول وإنشاء الحساب من الـ Context
  const { login, register, isAuthenticated } = useAuth();

  // ٢. حالة التاب النشط (login / register)
  const [activeTab, setActiveTab] = useState("login");

  // ٣. بيانات الفورم (للتسجيل والدخول)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // ٤. حالة الأخطاء والتحميل
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ٥. دالة تغيير الحقول
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // نمسح الخطأ لما المستخدم يبدأ يكتب
  };

  // ٦. دالة تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // التحقق من الحقول (Frontend Validation)
    if (!form.email || !form.password) {
      setError("البريد الإلكتروني وكلمة المرور مطلوبان");
      setLoading(false);
      return;
    }

    try {
      // منادي دالة login من الـ Context (هي دلوقتي وهمية، بعدين هنعدلها)
      await login(form.email, form.password);
      onClose(); // نقفل البوب اب بعد نجاح الدخول
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول. تأكد من بياناتك.");
    } finally {
      setLoading(false);
    }
  };

  // ٧. دالة إنشاء الحساب
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // التحقق من الحقول
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("جميع الحقول مطلوبة");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("كلمة المرور يجب أن تكون ٦ أحرف على الأقل");
      setLoading(false);
      return;
    }

    try {
      // منادي دالة register من الـ Context
      await register(form.name, form.email, form.password, "applicant");
      onClose(); // نقفل البوب اب بعد نجاح التسجيل
    } catch (err) {
      setError(err.message || "فشل إنشاء الحساب. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  // لو البوب اب مقفول، متظهرش حاجة
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* الـ Overlay (الخلفية المعتمة) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose} // لو ضغط على الخلفية، يقفل البوب اب
      >
        {/* الـ Modal (الصندوق الأبيض) */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
          onClick={(e) => e.stopPropagation()} // منع إغلاق البوب اب عند الضغط جواه
        >
          {/* زر الإغلاق (X) */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-lg p-1.5 transition-all hover:bg-[var(--surface-hover)]"
            style={{ color: "var(--text-muted)" }}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          {/* عنوان البوب اب */}
          <div className="mb-6 text-center">
            <h2 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              مرحباً بك
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              سجل دخولك أو أنشئ حساباً جديداً
            </p>
          </div>

          {/* الـ Tabs (التبديل بين الدخول والتسجيل) */}
          <div className="mb-6 flex rounded-xl border p-1" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "login"
                  ? "shadow-md"
                  : "hover:bg-[var(--surface-hover)]"
              }`}
              style={{
                backgroundColor: activeTab === "login" ? "var(--accent)" : "transparent",
                color: activeTab === "login" ? "#fff" : "var(--text-secondary)",
              }}
            >
              <UserIcon className="inline-block h-4 w-4 ml-2" />
              تسجيل دخول
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "register"
                  ? "shadow-md"
                  : "hover:bg-[var(--surface-hover)]"
              }`}
              style={{
                backgroundColor: activeTab === "register" ? "var(--accent)" : "transparent",
                color: activeTab === "register" ? "#fff" : "var(--text-secondary)",
              }}
            >
              <UserPlusIcon className="inline-block h-4 w-4 ml-2" />
              إنشاء حساب
            </button>
          </div>

          {/* عرض الخطأ إن وجد */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* ===== فورم تسجيل الدخول ===== */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                name="email"
                type="email"
                placeholder="البريد الإلكتروني"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                name="password"
                type="password"
                placeholder="كلمة المرور"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {loading ? "جاري تسجيل الدخول..." : "تسجيل دخول"}
              </Button>
            </form>
          )}

          {/* ===== فورم إنشاء الحساب ===== */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <Input
                name="name"
                placeholder="الاسم الكامل"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="البريد الإلكتروني"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                name="phone"
                type="tel"
                placeholder="رقم الجوال (اختياري)"
                value={form.phone}
                onChange={handleChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="كلمة المرور (٦ أحرف على الأقل)"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>
          )}

          {/* رابط للتبديل السريع بين التابين (في أسفل الفورم) */}
          <div className="mt-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            {activeTab === "login" ? (
              <p>
                ليس لديك حساب؟{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="font-semibold hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  أنشئ حساباً الآن
                </button>
              </p>
            ) : (
              <p>
                لديك حساب بالفعل؟{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="font-semibold hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  سجل دخولك
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}