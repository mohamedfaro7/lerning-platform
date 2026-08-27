import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import Input from "../component/common/Input";
import Button from "../component/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email, password, selectedRole);
    navigate(selectedRole === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "var(--bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <AcademicCapIcon className="h-8 w-8" style={{ color: "var(--accent)" }} />
            <span className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>أكاديمي</span>
          </Link>
        </div>

        <div className="rounded-2xl border p-6 backdrop-blur-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
          <h2 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>تسجيل الدخول</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>أدخل بياناتك للدخول</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex gap-2">
              {["student", "instructor", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className="flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all"
                  style={{
                    borderColor: selectedRole === r ? "var(--accent)" : "var(--border)",
                    backgroundColor: selectedRole === r ? "var(--accent)" : "transparent",
                    color: selectedRole === r ? "#fff" : "var(--text-secondary)",
                  }}
                >
                  {r === "student" ? "طالب" : r === "instructor" ? "معلم" : "مدير"}
                </button>
              ))}
            </div>

            <Input name="email" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input name="password" type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" className="w-full">
              دخول
            </Button>
          </form>

          <p className="mt-4 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            ليس لديك حساب؟{" "}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: "var(--accent-text)" }}>
              سجّل الآن
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
