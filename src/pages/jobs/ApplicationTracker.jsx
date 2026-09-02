import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  DocumentTextIcon,
  SparklesIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// مراحل متابعة الطلب الأكاديمي
const STEPS = [
  {
    id: 1,
    title: "استلام الطلب",
    description: "استلام الملف المبدئي.",
    icon: DocumentTextIcon,
    details: "تم استلام الطلب وتجهيز المستندات للمراجعة الأكاديمية.",
  },
  {
    id: 2,
    title: "مراجعة السيرة الذاتية (AI)",
    description: "تحليل السيرة الذاتية باستخدام الذكاء الاصطناعي.",
    icon: SparklesIcon,
    details: "نسبة التطابق: 87% • نقاط القوة: React, قيادة الفرق • نقاط الضعف: DevOps",
  },
  {
    id: 3,
    title: "التقييم التقني",
    description: "مراجعة المشاريع السابقة.",
    icon: SparklesIcon,
    details: "التقييم التقني: 85/100 • جودة كود ممتازة.",
  },
  {
    id: 4,
    title: "المقابلة",
    description: "مقابلة المشرف الأكاديمي.",
    icon: CalendarIcon,
    details: "رابط التواجد وسيتم إرساله عبر البريد الإلكتروني.",
  },
  {
    id: 5,
    title: "التقييم النهائي",
    description: "مراجعة الأداء الشامل.",
    icon: ChatBubbleLeftRightIcon,
    details: "تم التقييم بناءً على نتائج المقابلة والاختبار التطبيقي.",
  },
   {
    id: 6,
    title: "القرار النهائي",
    description: "إعلان النتيجة النهائية للقبول أو الرفض.",
    icon: ShieldCheckIcon,
    details: "سيتم إرسال القرار النهائي مع تفاصيل إضافية.",
  },
];

const MOCK_DATA = {
  overallStatus: "in-progress",
  rejectionReason: "",
  steps: [
    { id: 1, status: "completed" },
    { id: 2, status: "active" },
    { id: 3, status: "pending" },
    { id: 4, status: "pending" },
    { id: 5, status: "pending" },
    { id: 6, status: "pending" },
  ],
};

export default function ApplicationTracker() {
  const [application, setApplication] = useState(MOCK_DATA);
  const [selectedStep, setSelectedStep] = useState(2);

  const simulateStatus = (status) => {
    if (status === "accepted") {
      setApplication({
        ...application,
        overallStatus: "accepted",
        steps: application.steps.map((s) => ({
          ...s,
          status: s.id <= 5 ? "completed" : "pending",
        })),
      });
      setSelectedStep(5);
    } else if (status === "rejected") {
      setApplication({
        ...application,
        overallStatus: "rejected",
        rejectionReason: "المؤهلات المقدمة غير مكتملة لهذا المسار الأكاديمي.",
        steps: application.steps.map((s) => ({
          ...s,
          status: s.id < 2 ? "completed" : s.id === 2 ? "rejected" : "pending",
        })),
      });
      setSelectedStep(2);
    } else {
      setApplication(MOCK_DATA);
      setSelectedStep(2);
    }
  };

  const activeStepData = STEPS.find((s) => s.id === selectedStep);
  const activeStepStatus = application.steps.find((s) => s.id === selectedStep)?.status;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 dir-rtl" dir="rtl">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <AcademicCapIcon className="h-4 w-4 text-indigo-400" />
            متابعة التقديم الأكاديمي
          </div>
          <h1 className="mt-4 text-2xl font-black text-white sm:text-3xl">
            مسار انضمامك <span className="text-indigo-400">للبرنامج</span>
          </h1>
        </div>

        {/* Main Dark Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          
          {/* Header Controls & Status */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <div>
              <p className="text-xs font-medium text-slate-400">حالة الطلب الحالية</p>
              <p className="mt-1 text-base font-bold sm:text-lg">
                {application.overallStatus === "accepted" && (
                  <span className="text-emerald-400 flex items-center gap-1">✅ تم القبول بنجاح</span>
                )}
                {application.overallStatus === "rejected" && (
                  <span className="text-rose-400 flex items-center gap-1">❌ تم رفض الطلب</span>
                )}
                {application.overallStatus === "in-progress" && (
                  <span className="text-indigo-400 flex items-center gap-1">⏳ جاري المعالجة...</span>
                )}
              </p>
            </div>

            {/* Simulation Controls in Dark Theme */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1.5">
              <button
                onClick={() => simulateStatus("in-progress")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  application.overallStatus === "in-progress"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                جاري
              </button>

              {/* Accepted Button in Bright Emerald Green */}
              <button
                onClick={() => simulateStatus("accepted")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  application.overallStatus === "accepted"
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : "border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                }`}
              >
                مقبول (Accepted)
              </button>

              {/* Rejected Button in Bright Rose Red */}
              <button
                onClick={() => simulateStatus("rejected")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  application.overallStatus === "rejected"
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                    : "border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                }`}
              >
                مرفوض (Rejected)
              </button>
            </div>
          </div>

          {/* Horizontal Stepper (Dark Mode) */}
          <div className="relative mb-10 overflow-x-auto pb-4 pt-2">
            <div className="flex min-w-[650px] items-center justify-between relative px-6">
              
              {/* Dark Backline */}
              <div className="absolute left-10 right-10 top-5 h-0.5 -translate-y-1/2 bg-slate-800 z-0" />

              {STEPS.map((step, index) => {
                const stepStatus = application.steps[index]?.status || "pending";
                const isCompleted = stepStatus === "completed";
                const isRejected = stepStatus === "rejected";
                const isActive = stepStatus === "active";
                const isSelected = selectedStep === step.id;

                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStep(step.id)}
                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                  >
                    {/* Dark Status Circle */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-xs transition-all duration-300 ${
                        isCompleted
                          ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                          : isRejected
                          ? "border-rose-500 bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                          : isActive
                          ? "border-indigo-500 bg-indigo-600 text-white ring-4 ring-indigo-950/80"
                          : "border-slate-800 bg-slate-900 text-slate-500 group-hover:border-slate-700"
                      } ${isSelected ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900" : ""}`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="h-5 w-5 stroke-[3]" />
                      ) : isRejected ? (
                        <XMarkIcon className="h-5 w-5 stroke-[3]" />
                      ) : isActive ? (
                        <ClockIcon className="h-5 w-5 animate-spin" />
                      ) : (
                        step.id
                      )}
                    </motion.div>

                    {/* Step Title */}
                    <span
                      className={`mt-2.5 text-xs font-bold text-center max-w-[90px] transition-colors ${
                        isCompleted
                          ? "text-emerald-400"
                          : isRejected
                          ? "text-rose-400"
                          : isActive || isSelected
                          ? "text-indigo-400"
                          : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Step Context Box */}
          <AnimatePresence mode="wait">
            {activeStepData && (
              <motion.div
                key={activeStepData.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border p-5 ${
                  activeStepStatus === "completed"
                    ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-200"
                    : activeStepStatus === "rejected"
                    ? "border-rose-500/30 bg-rose-950/20 text-rose-200"
                    : "border-slate-800 bg-slate-950/40 text-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500">
                        المرحلة {activeStepData.id} من ٦
                      </span>
                      {activeStepStatus === "completed" && (
                        <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          مكتملة بنجاح ✓
                        </span>
                      )}
                      {activeStepStatus === "rejected" && (
                        <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                          غير مقبولة ✕
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {activeStepData.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {activeStepData.details}
                    </p>
                  </div>
                </div>

                {activeStepStatus === "rejected" && application.rejectionReason && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs font-semibold text-rose-300">
                    <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                    <span>سبب الرفض: {application.rejectionReason}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              <ArrowRightIcon className="h-4 w-4" />
              العودة للرئيسية
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}