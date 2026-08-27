import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import AnimatedGridBackground from "../component/common/AnimatedGridBackground";
import Input from "../component/common/Input";
import Button from "../component/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email, password, "student");
    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4" style={{ backgroundColor: "var(--bg)" }}>
      <AnimatedGridBackground />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <AcademicCapIcon className="h-8 w-8" style={{ color: "var(--accent)" }} />
            <span className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>أكاديمي</span>
          </Link>
        </div>

        <div className="rounded-2xl border p-6 backdrop-blur-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
          <h2 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>تسجيل الدخول</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>أدخل بياناتك للدخول كطالب</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Input name="email" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input name="password" type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" className="w-full">
              دخول
            </Button>
          </form>

          <div className="mt-4 flex flex-col gap-2 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            <p>
              ليس لديك حساب؟{" "}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: "var(--accent-text)" }}>
                سجّل الآن
              </Link>
            </p>
            <Link to="/staff-login" className="hover:underline" style={{ color: "var(--accent-text)" }}>
              دخول الفريق والأدمن
            </Link>
            <Link to="/" className="hover:underline">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
