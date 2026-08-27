import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AcademicCapIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import Input from "../component/common/Input";
import Button from "../component/common/Button";
import AnimatedGridBackground from "../component/common/AnimatedGridBackground";

const STAFF_ROLES = [
  "technical_manager",
  "track_head",
  "academic_reviewer",
  "ops_planner",
  "quality_reviewer",
  "admin",
];

export default function StaffLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(STAFF_ROLES[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email, password, selectedRole);
    navigate("/staff");
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
          <div className="mt-3 flex items-center justify-center gap-2" style={{ color: "var(--text-secondary)" }}>
            <BriefcaseIcon className="h-4 w-4" />
            <span className="text-xs font-medium">لوحة الفريق والأدمن</span>
          </div>
        </div>

        <div className="rounded-2xl border p-6 backdrop-blur-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
          <h2 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>دخول الفريق</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>سجّل دخولك كعضو في الفريق</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>الدور</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ borderColor: "var(--input-border)", color: "var(--text-primary)", backgroundColor: "var(--input-bg)" }}
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r === "technical_manager" ? "مدير تقني" :
                     r === "track_head" ? "رئيس مسار" :
                     r === "academic_reviewer" ? "مراجع أكاديمي" :
                     r === "ops_planner" ? "مخطط عمليات" :
                     r === "quality_reviewer" ? "مراجع جودة" :
                     "المشرف العام"}
                  </option>
                ))}
              </select>
            </div>

            <Input name="email" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input name="password" type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" className="w-full">
              دخول
            </Button>
          </form>

          <div className="mt-4 flex flex-col gap-2 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            <Link to="/login" className="hover:underline" style={{ color: "var(--accent-text)" }}>
              تسجيل دخول الطالب
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
