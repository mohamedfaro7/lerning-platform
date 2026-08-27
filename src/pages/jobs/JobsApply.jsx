import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Input from "../../component/common/Input";
import Button from "../../component/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../component/common/layout/JobsLayout";

const POSITIONS = [
  { id: "technical_manager", title: "مدير تقني", dept: "الهندسة", color: "#3b82f6" },
  { id: "track_head", title: "رئيس مسار برمجي", dept: "التعليم", color: "#a855f7" },
  { id: "academic_reviewer", title: "مراجع أكاديمي", dept: "المحتوى", color: "#06b6d4" },
  { id: "ops_planner", title: "مخطط عمليات", dept: "العمليات", color: "#10b981" },
  { id: "quality_reviewer", title: "مراجع جودة", dept: "المحتوى", color: "#f59e0b" },
  { id: "admin", title: "المشرف العام", dept: "الإدارة", color: "#ef4444" },
];

const STEPS = [
  { key: "personal", icon: UserIcon, label: "البيانات الشخصية" },
  { key: "position", icon: BriefcaseIcon, label: "اختر الوظيفة" },
  { key: "experience", icon: AcademicCapIcon, label: "الخبرات" },
  { key: "review", icon: PaperAirplaneIcon, label: "المراجعة والإرسال" },
];

export default function JobsApply() {
  const { user, pendingApplication } = useAuth();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    position: pendingApplication?.role || "",
    experience: "",
    education: "",
    why: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setForm((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircleIcon className="mx-auto h-16 w-16" style={{ color: "#10b981" }} />
          <h2 className="mt-4 font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            تم إرسال طلبك بنجاح!
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            سنتواصل معك قريباً. شكراً لاهتمامك بالانضمام لفريق أكاديمي.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Step Indicator */}
      <div className="mb-10 flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all"
              style={{
                backgroundColor: i <= step ? "var(--accent)" : "var(--card)",
                color: i <= step ? "#fff" : "var(--text-muted)",
                borderColor: "var(--border)",
                borderWidth: i > step ? "1px" : "0",
              }}
            >
              {i < step ? <CheckCircleIcon className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className="hidden text-xs font-medium sm:block"
              style={{ color: i <= step ? "var(--accent-text)" : "var(--text-muted)" }}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className="mx-2 h-px w-6 sm:w-12"
                style={{ backgroundColor: i < step ? "var(--accent)" : "var(--border)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div
        className="rounded-2xl border p-6 backdrop-blur-sm sm:p-8"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>البيانات الشخصية</h3>
              <Input name="name" placeholder="الاسم الكامل" value={form.name} onChange={handleChange} />
              <Input name="email" type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={handleChange} />
              <Input name="phone" type="tel" placeholder="رقم الجوال" value={form.phone} onChange={handleChange} />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="position" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-3">
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>اختر الوظيفة</h3>
              {POSITIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setForm((prev) => ({ ...prev, position: p.id }))}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-right transition-all ${
                    form.position === p.id ? "ring-2" : ""
                  }`}
                  style={{
                    borderColor: form.position === p.id ? p.color : "var(--border)",
                    backgroundColor: form.position === p.id ? `${p.color}10` : "transparent",
                    ["--tw-ring-color"]: p.color,
                  }}
                >
                  <div className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{p.title}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{p.dept}</p>
                  </div>
                  {form.position === p.id && <CheckCircleIcon className="h-5 w-5" style={{ color: p.color }} />}
                </button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="experience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>الخبرات والمؤهلات</h3>
              <Input name="education" placeholder="المؤهل الدراسي" value={form.education} onChange={handleChange} />
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>الخبرة السابقة</label>
                <textarea
                  name="experience"
                  rows="3"
                  placeholder="اكتب خبراتك السابقة..."
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)" }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>لماذا تريد الانضمام؟</label>
                <textarea
                  name="why"
                  rows="3"
                  placeholder="اكتب سبب رغبتك في الانضمام..."
                  value={form.why}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)" }}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>مراجعة طلبك</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الاسم</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{form.name || "—"}</p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>البريد</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{form.email || "—"}</p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الجوال</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{form.phone || "—"}</p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الوظيفة</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {POSITIONS.find((p) => p.id === form.position)?.title || "—"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>المؤهل</p>
                <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{form.education || "—"}</p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الخبرة</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-primary)" }}>{form.experience || "—"}</p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>لماذا تريد الانضمام؟</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-primary)" }}>{form.why || "—"}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={prev}
              className="flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium transition-all hover:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <ChevronRightIcon className="h-4 w-4" />
              السابق
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="flex items-center gap-1 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "var(--accent)" }}
            >
              التالي
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "#10b981" }}
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              إرسال الطلب
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
