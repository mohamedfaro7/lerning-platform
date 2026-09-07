import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowLeftIcon,
  UserIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function MyApplications() {
  const { applications, updateApplicationStatus } = useAuth();

  const STEPS_LABELS = [
    "تقديم الطلب",
    "مراجعة السيرة الذاتية",
    "التقييم الأكاديمي",
    "المقابلة الفنية",
    "التخطيط التشغيلي",
    "القرار النهائي",
  ];

  const handleAdvanceStep = (app) => {
    const nextStep = (app.currentStep || 0) + 1;
    if (nextStep < STEPS_LABELS.length) {
      const newStatus =
        nextStep === STEPS_LABELS.length - 1 ? "accepted" : "in-progress";
      updateApplicationStatus(app.id, newStatus, nextStep);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 dir-rtl" dir="rtl">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              تتبع طلبات التقديم 📋
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              تابع مراحل القبول والمراجعة الخاصة بكل وظيفة تقدمت عليها
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-800"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            الرئيسية
          </Link>
        </div>

        {/* List of Applications */}
        {!applications || applications.length === 0 ? (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-12 text-center backdrop-blur-xl">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="mt-4 text-lg font-bold text-slate-300">
              لا توجد طلبات تقديم حتى الآن
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              قم بالتصفح والتقديم على الوظائف المتاحة لتتمكن من تتبع حالتك هنا.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              // التحقق من حالة القرار النهائي
              const isFinalDecision =
                app.currentStep === STEPS_LABELS.length - 1 ||
                app.status === "accepted" ||
                app.status === "rejected";

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-2xl"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                        <BriefcaseIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-white">
                          {app.jobRole || "المسمى الوظيفي"}
                        </h2>
                        <span className="text-[11px] font-mono text-slate-400">
                          ID: {app.id} • تاريخ التقديم:{" "}
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("ar-EG") : "2026/9/7"}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {app.status === "accepted" && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                          <CheckCircleIcon className="h-4 w-4" /> مقبول نهائيًا
                        </span>
                      )}
                      {app.status === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400">
                          <XCircleIcon className="h-4 w-4" /> تم الاعتذار
                        </span>
                      )}
                      {app.status !== "accepted" && app.status !== "rejected" && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
                          <ClockIcon className="h-4 w-4 animate-spin" /> قيد المراجعة
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stepper Tracking UI */}
                  <div className="my-6">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                      {STEPS_LABELS.map((stepName, idx) => {
                        const isCompleted = idx < app.currentStep;
                        const isActive = idx === app.currentStep;

                        return (
                          <div
                            key={idx}
                            className={`flex flex-col items-center rounded-2xl p-3 text-center border transition-all ${
                              isActive
                                ? "border-indigo-500/50 bg-indigo-500/10 text-white"
                                : isCompleted
                                ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                                : "border-slate-800/40 bg-slate-950/40 text-slate-500"
                            }`}
                          >
                            <span className="text-[10px] font-bold">
                              الخطوة {idx + 1}
                            </span>
                            <span className="mt-1 text-xs font-semibold">
                              {stepName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Actions & Profile Unlock */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 pt-4">
                    {/* Unlocked Profile Button */}
                    {isFinalDecision ? (
                      <Link
                        to={`/profile/${app.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-400 transition-all"
                      >
                        <UserIcon className="h-4 w-4" />
                        عرض الملف الشخصي والقرار النهائي
                      </Link>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        🔒 ينفتح الملف الشخصي المعتمد عند الوصول للقرار النهائي
                      </span>
                    )}

                    {/* Dev Tool: Simulation Button */}
                    <button
                      onClick={() => handleAdvanceStep(app)}
                      disabled={isFinalDecision}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                    >
                      <SparklesIcon className="h-3.5 w-3.5 text-amber-400" />
                      محاكاة تقدم المرحلة
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}