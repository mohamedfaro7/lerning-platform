import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useAuth } from "../../context/AuthContext";

// تعريف المراحل (ثابتة)
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
    title: "تحليل الذكاء الاصطناعي",
    description: "مطابقة المهارات والسيرة.",
    icon: SparklesIcon,
    details: "نسبة التطابق الأكاديمي: 87% • مهارات قوية في بناء الواجهات برياكت.",
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
    title: "القبول والدراسة",
    description: "تفعيل الحساب والبدء.",
    icon: ShieldCheckIcon,
    details: "تفعيل الوصول للمنهج التعليمي والانضمام لمجموعة الدفعة.",
  },
];

export default function ApplicationTracker() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { getApplicationById, updateApplicationStatus } = useAuth();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState(1);

  // تحميل بيانات الطلب من السياق
  useEffect(() => {
    if (applicationId) {
      const appData = getApplicationById(applicationId);
      if (appData) {
        setApplication(appData);
        // تعيين الخطوة النشطة بناءً على currentStep في الطلب
        setSelectedStep((appData.currentStep ?? 0) + 1);
      } else {
        setApplication(null);
      }
    }
    setLoading(false);
  }, [applicationId, getApplicationById]);

  // دالة لتحديث الحالة محلياً وفي Context للمحاكاة
  const handleStatusUpdate = (newStatus, reason = "") => {
    if (!applicationId || !updateApplicationStatus) return;

    updateApplicationStatus(applicationId, newStatus, reason);

    // تحديث الواجهة فوراً
    setApplication((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: newStatus,
        rejectionReason: reason || prev.rejectionReason,
      };
    });
  };

  // إذا كان الطلب قيد التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 dir-rtl" dir="rtl">
        <div className="mx-auto max-w-5xl text-center">
          <div className="animate-pulse text-indigo-400">جاري تحميل بيانات الطلب...</div>
        </div>
      </div>
    );
  }

  // إذا كان الطلب غير موجود
  if (!application) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 dir-rtl" dir="rtl">
        <div className="mx-auto max-w-5xl text-center">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-12 shadow-2xl backdrop-blur-xl">
            <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-rose-400" />
            <h2 className="mt-4 text-2xl font-bold text-white">الطلب غير موجود</h2>
            <p className="mt-2 text-slate-400">لم نتمكن من العثور على هذا الطلب. قد يكون قد تم حذفه أو أن الرابط غير صحيح.</p>
            <button
              onClick={() => navigate("/jobs")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              العودة للوظائف
            </button>
          </div>
        </div>
      </div>
    );
  }

  // إذا تم العثور على الطلب
  const overallStatus = application.status;
  const stepsWithStatus = STEPS.map((step, index) => {
    const stepData = application.steps?.[index] || { status: "pending" };
    return { ...step, status: stepData.status };
  });

  const activeStepData = STEPS.find((s) => s.id === selectedStep);
  const activeStepStatus = stepsWithStatus.find((s) => s.id === selectedStep)?.status;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 dir-rtl" dir="rtl">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <AcademicCapIcon className="h-4 w-4 text-indigo-400" />
            متابعة التقديم الأكاديمي #{applicationId.slice(-6)}
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
                {overallStatus === "accepted" && (
                  <span className="text-emerald-400 flex items-center gap-1">✅ تم القبول بنجاح</span>
                )}
                {overallStatus === "rejected" && (
                  <span className="text-rose-400 flex items-center gap-1">❌ تم رفض الطلب</span>
                )}
                {overallStatus === "in-progress" && (
                  <span className="text-indigo-400 flex items-center gap-1">⏳ جاري المعالجة...</span>
                )}
              </p>
            </div>

            {/* أزرار المحاكاة */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1.5">
              <button
                onClick={() => handleStatusUpdate("in-progress")}
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-all"
              >
                جاري
              </button>
              <button
                onClick={() => handleStatusUpdate("accepted")}
                className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition-all"
              >
                مقبول
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected", "عدم استيفاء الشروط الأكاديمية")}
                className="rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
              >
                مرفوض
              </button>
            </div>
          </div>

          {/* Horizontal Stepper (Dark Mode) */}
          <div className="relative mb-10 overflow-x-auto pb-4 pt-2">
            <div className="flex min-w-[650px] items-center justify-between relative px-6">
              
              <div className="absolute left-10 right-10 top-5 h-0.5 -translate-y-1/2 bg-slate-800 z-0" />

              {stepsWithStatus.map((step) => {
                const isCompleted = step.status === "completed";
                const isRejected = step.status === "rejected";
                const isActive = step.status === "active";
                const isSelected = selectedStep === step.id;

                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStep(step.id)}
                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                  >
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
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              <ArrowRightIcon className="h-4 w-4" />
              العودة للوظائف
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}