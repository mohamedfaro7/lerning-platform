import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BriefcaseIcon, MapPinIcon, ClockIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../component/common/layout/JobsLayout";

const JOBS = [
  { id: 1, title: "مدير تقني", department: "الهندسة", location: "عن بُعد", type: "دوام كامل", description: "إدارة فريق التطوير والإشراف على البنية التحتية التقنية للمنصة.", color: "#3b82f6", role: "technical_manager" },
  { id: 2, title: "رئيس مسار برمجي", department: "التعليم", location: "الرياض", type: "دوام كامل", description: "قيادة المسار البرمجي وتصميم المنهج والإشراف على المدرسين.", color: "#a855f7", role: "track_head" },
  { id: 3, title: "مراجع أكاديمي", department: "المحتوى", location: "عن بُعد", type: "دوام جزئي", description: "مراجعة المحتوى الأكاديمي وضمان جودة الدروس والكورسات.", color: "#06b6d4", role: "academic_reviewer" },
  { id: 4, title: "مخطط عمليات", department: "العمليات", location: "الرياض", type: "دوام كامل", description: "التخطيط والتنسيق بين الأقسام المختلفة لضمان سير العمل بسلاسة.", color: "#10b981", role: "ops_planner" },
  { id: 5, title: "مراجع جودة", department: "المحتوى", location: "عن بُعد", type: "دوام جزئي", description: "مراجعة وتقييم جودة المحتوى التعليمي وتقديم توصيات للتحسين.", color: "#f59e0b", role: "quality_reviewer" },
  { id: 6, title: "المشرف العام", department: "الإدارة", location: "الرياض", type: "دوام كامل", description: "الإشراف العام على جميع أنشطة المنصة وإدارة الفرق.", color: "#ef4444", role: "admin" },
];

export default function Jobs() {
  const { isAuthenticated, setPendingApplication } = useAuth();
  const { setActive } = useSidebar();
  const navigate = useNavigate();
  const handleApply = (job) => {
    setPendingApplication(job); // خزن الوظيفة في السياق

    if (isAuthenticated) {
      // لو مسجل، روح لصفحة التقديم مباشرة
      setActive("apply");
    } else {
      // لو مش مسجل، روح لصفحة التسجيل الخاصة بالوظائف
      navigate("/jobs/register");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-black" style={{ color: "var(--text-primary)" }}>
          الوظائف <span style={{ color: "var(--accent)" }}>المتاحة</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          اختر الوظيفة المناسبة وقدّم طلبك.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {JOBS.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.01, boxShadow: `0 0 24px ${job.color}18` }}
            className="group flex flex-col gap-3 rounded-2xl border p-5 backdrop-blur-sm transition-all"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${job.color}18`, color: job.color }}>
                {job.department}
              </span>
              <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                <ClockIcon className="h-3 w-3" />
                {job.type}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>{job.title}</h3>
              <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <MapPinIcon className="h-3 w-3" />
                {job.location}
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{job.description}</p>

            <div className="mt-auto pt-1">
              <button
                onClick={() => handleApply(job)}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: job.color }}
              >
                <BriefcaseIcon className="h-4 w-4" />
                تقدّم الآن
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
