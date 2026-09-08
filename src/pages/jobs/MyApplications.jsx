import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowLeftIcon,
  UserIcon,
  SparklesIcon,
  FolderOpenIcon,
  XMarkIcon,
  CheckIcon,
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

  // حالة التحكم بفتح/إغلاق القائمة المخفية
  const [isListOpen, setIsListOpen] = useState(false);

  // حالة تحديد الطلب المعروض (افتراضياً أحدث طلب - الأول)
  const [selectedAppId, setSelectedAppId] = useState(
    applications && applications.length > 0 ? applications[0].id : null
  );

  const currentApp =
    applications?.find((app) => app.id === selectedAppId) || applications?.[0];

  const handleAdvanceStep = (app) => {
    const nextStep = (app.currentStep || 0) + 1;
    if (nextStep < STEPS_LABELS.length) {
      const newStatus =
        nextStep === STEPS_LABELS.length - 1 ? "accepted" : "in-progress";
      updateApplicationStatus(app.id, newStatus, nextStep);
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-slate-100 dir-rtl" dir="rtl">
        <div className="mx-auto max-w-4xl pt-12">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-12 text-center backdrop-blur-xl">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="mt-4 text-lg font-bold text-slate-300">لا توجد طلبات تقديم حتى الآن</h3>
            <p className="mt-2 text-xs text-slate-500">قم بالتصفح والتقديم على الوظائف لتتبع حالتك هنا.</p>
          </div>
        </div>
      </div>
    );
  }

  const isFinalDecision =
    currentApp?.currentStep === STEPS_LABELS.length - 1 ||
    currentApp?.status === "accepted" ||
    currentApp?.status === "rejected";

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 dir-rtl" dir="rtl">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">تتبع الطلبات 📋</h1>
            <p className="mt-1 text-sm text-slate-400">تابع مرحلة القبول الخاصة بطلباتك بكل سهولة</p>
          </div>

          <div className="flex items-center gap-3">
            {/* 🎯 زر فتح أرشيف باقي الوظائف (يظهر فقط إذا كان هناك أكثر من طلب) */}
            {applications.length > 1 && (
              <button
                onClick={() => setIsListOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 transition-all hover:bg-indigo-500/20 hover:border-indigo-500/50"
              >
                <FolderOpenIcon className="h-4 w-4 text-indigo-400" />
                سجل الطلبات ({applications.length})
              </button>
            )}

            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-800"
            >
              <ArrowLeftIcon className="h-4 w-4" /> الرئيسية
            </Link>
          </div>
        </div>

        {/* 🌟 1. HERO ACTIVE APPLICATION CARD (المساحة المستغلة الوحيدة) */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentApp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-950/20 backdrop-blur-2xl"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">{currentApp.jobRole || "المسمى الوظيفي"}</h2>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {currentApp.id} • تاريخ التقديم:{" "}
                      {currentApp.appliedAt ? new Date(currentApp.appliedAt).toLocaleDateString("ar-EG") : "2026/9/7"}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {currentApp.status === "accepted" && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircleIcon className="h-4 w-4" /> مقبول نهائيًا
                    </span>
                  )}
                  {currentApp.status === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400">
                      <XCircleIcon className="h-4 w-4" /> تم الاعتذار
                    </span>
                  )}
                  {currentApp.status !== "accepted" && currentApp.status !== "rejected" && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400">
                      <ClockIcon className="h-4 w-4 animate-spin" /> قيد المراجعة
                    </span>
                  )}
                </div>
              </div>

              {/* Stepper Tracking UI */}
              <div className="my-6">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                  {STEPS_LABELS.map((stepName, idx) => {
                    const isCompleted = idx < currentApp.currentStep;
                    const isActive = idx === currentApp.currentStep;

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center rounded-2xl p-3 text-center border transition-all ${
                          isActive
                            ? "border-indigo-500/60 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10"
                            : isCompleted
                            ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                            : "border-slate-800/60 bg-slate-950/40 text-slate-500"
                        }`}
                      >
                        <span className="text-[10px] font-bold">الخطوة {idx + 1}</span>
                        <span className="mt-1 text-xs font-semibold">{stepName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                {isFinalDecision ? (
                  <Link
                    to={`/profile/${currentApp.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-400 transition-all"
                  >
                    <UserIcon className="h-4 w-4" /> عرض الملف الشخصي والقرار النهائي
                  </Link>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500">
                    🔒 ينفتح الملف الشخصي المعتمد عند الوصول للقرار النهائي
                  </span>
                )}

                <button
                  onClick={() => handleAdvanceStep(currentApp)}
                  disabled={isFinalDecision}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                >
                  <SparklesIcon className="h-3.5 w-3.5 text-amber-400" /> محاكاة تقدم المرحلة
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 🗂️ 2. POPUP MODAL FOR APPLICATIONS LIST (لا تأخذ أي مساحة وتظهر عند الضغط فقط) */}
        <AnimatePresence>
          {isListOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
              >
                <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FolderOpenIcon className="h-5 w-5 text-indigo-400" /> اختر الطلب للمعاينة
                  </h3>
                  <button
                    onClick={() => setIsListOpen(false)}
                    className="rounded-xl p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                  {applications.map((app) => {
                    const isSelected = app.id === currentApp.id;

                    return (
                      <button
                        key={app.id}
                        onClick={() => {
                          setSelectedAppId(app.id);
                          setIsListOpen(false); // إغلاق القائمة فور الاختيار
                        }}
                        className={`w-full flex items-center justify-between rounded-2xl p-3.5 text-right transition-all border ${
                          isSelected
                            ? "border-indigo-500/60 bg-indigo-500/10 ring-1 ring-indigo-500/30"
                            : "border-slate-800/60 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {app.status === "accepted" ? (
                            <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                          ) : app.status === "rejected" ? (
                            <XCircleIcon className="h-5 w-5 text-rose-400 shrink-0" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-amber-400 shrink-0" />
                          )}

                          <div>
                            <h4 className={`text-xs font-bold ${isSelected ? "text-indigo-300" : "text-slate-200"}`}>
                              {app.jobRole || "المسمى الوظيفي"}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {app.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                            الخطوة {app.currentStep + 1} / {STEPS_LABELS.length}
                          </span>
                          {isSelected && <CheckIcon className="h-4 w-4 text-indigo-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}