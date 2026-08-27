import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import Input from "../component/common/Input";
import Button from "../component/common/Button";
import AnimatedGridBackground from "../component/common/AnimatedGridBackground";

export default function Register() {
  const { register, pendingApplication } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    register(form.name, form.email, form.password, "applicant");
    if (pendingApplication) {
      navigate("/apply");
    } else {
      navigate("/");
    }
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
          {pendingApplication && (
            <p className="mt-3 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--border)", color: "var(--accent-text)", backgroundColor: "var(--card)" }}>
              تسجيل للتقديم على: <span className="font-bold">{pendingApplication.title}</span>
            </p>
          )}
        </div>

        <div className="rounded-2xl border p-6 backdrop-blur-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
          <h2 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>حساب جديد</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>أنشئ حسابك لبدء التعلم أو التقديم</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Input name="name" placeholder="الاسم الكامل" value={form.name} onChange={handleChange} />
            <Input name="email" type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={handleChange} />
            <Input name="password" type="password" placeholder="كلمة المرور" value={form.password} onChange={handleChange} />

            <Button type="submit" className="w-full">
              {pendingApplication ? "إنشاء حساب وتقديم" : "إنشاء حساب"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: "var(--accent-text)" }}>
              سجّل دخولك
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
