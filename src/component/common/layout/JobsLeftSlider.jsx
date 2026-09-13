import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  CheckCircleIcon,
  SparklesIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  BriefcaseIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";

export default function JobsLeftSlider({ isOpen, onClose }) {
  // 🎯 استخراج كافة البيانات المطلوبة من الـ AuthContext في الأعلى
  const { user, isAuthenticated, logout, openAuthModal, applications = [], pendingApplication } = useAuth();
  const navigate = useNavigate();

  // 🎯 استخراج الطلب المكتمل إن وجد
  const unlockedApp = applications.find(
    (app) =>
      app.status === "accepted" ||
      app.status === "rejected" ||
      app.currentStep === 5
  );

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleAiAssistant = () => {
    console.log("Opening AI Assistant...");
    onClose();
  };

  // 🎯 معالجة التوجيه لمراجعة الطلبات
  const handleNavigateToReviewQueue = () => {
    navigate("/jobs/review-queue");
    onClose();
  };

  // 🎯 معالجة التوجيه لتفاصيل المسارات
  const handleNavigateToTracks = () => {
    if (pendingApplication?.trackId) {
      navigate(`/jobs/tracks-profiles?track=${pendingApplication.trackId}&job=${pendingApplication.id}`);
    } else {
      navigate("/jobs/tracks-profiles");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Slider Drawer */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed bottom-0 left-0 z-50 max-h-[88vh] w-full border-t border-slate-800/80 bg-slate-950/90 p-6 text-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-3xl dir-rtl sm:w-96 sm:rounded-tr-3xl sm:border-r"
            dir="rtl"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="mb-4 flex justify-center">
              <div className="h-1.5 w-10 rounded-full bg-slate-800" />
            </div>

            {/* Header */}
            <div className="relative mb-5 flex items-center justify-between border-b border-slate-800/60 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 font-black text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                  {isAuthenticated ? (
                    user?.name?.charAt(0)?.toUpperCase() || "U"
                  ) : (
                    <SparklesIcon className="h-6 w-6 text-indigo-100" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-base font-extrabold tracking-wide text-white">
                    {isAuthenticated ? user?.name || "مستخدم" : "مرحباً بك!"}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {isAuthenticated ? user?.email || "حساب شخصي" : "استكشف الفرص الوظيفية"}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-2 text-slate-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* AI Assistant */}
            <div className="mb-3">
              <button
                onClick={handleAiAssistant}
                className="group flex w-full items-center justify-between rounded-2xl border border-rose-500/30 bg-slate-900 p-3.5 hover:border-rose-500/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
                    <CpuChipIcon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-100">AI Assistant</span>
                    <span className="text-[10px] text-slate-400">مساعد الذكاء الاصطناعي</span>
                  </div>
                </div>
                <ChevronLeftIcon className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {/* Main Items Area */}
            <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
              {isAuthenticated ? (
                <>
                  {/* 🎓 1. Candidature Profil Button */}
                  {unlockedApp && (
                    <Link
                      to={`/profile/${unlockedApp.id}`}
                      onClick={onClose}
                      className="group flex w-full items-center justify-between rounded-2xl border border-indigo-500/50 bg-gradient-to-r from-indigo-950/60 to-slate-900 p-3.5 transition-all duration-300 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-950/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-xs font-bold text-indigo-200">
                            ملف الترشح والقرار النهائي 🎓
                          </span>
                          <span className="text-[10px] text-slate-400">
                            استعرض النتيجة والبيانات المعتمدة
                          </span>
                        </div>
                      </div>
                      <ChevronLeftIcon className="h-4 w-4 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  )}

                  {/* 📋 2. My Applications Button */}
                  <Link
                    to="/my-applications"
                    onClick={onClose}
                    className="group flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300">
                        <BriefcaseIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-xs font-bold text-slate-100">طلبات التقديم</span>
                        <span className="text-[10px] text-slate-400">تتبع حالة القبول والخطوات</span>
                      </div>
                    </div>
                    <span className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                      {applications.length} طلب
                    </span>
                  </Link>

                  {/* 🛡️ 3. Account Status */}
                  <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-300">حالة الحساب</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircleIcon className="h-3.5 w-3.5" /> نشط ومسجل
                    </span>
                  </div>

                  {/* ⭐ 4. Review Queue */}
                  <button
                    onClick={handleNavigateToReviewQueue}
                    className="group flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 hover:border-slate-700 hover:bg-slate-900 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                        <ClipboardDocumentListIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-xs font-bold text-slate-100">مركز تدقيق الطلبات</span>
                        <span className="text-[10px] text-slate-400">Review Queue</span>
                      </div>
                    </div>
                    <ChevronLeftIcon className="h-4 w-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
                  </button>

                  {/* ⭐ 5. عرض تفاصيل المسارات والوظائف */}
                  <button
                    onClick={handleNavigateToTracks}
                    className="group flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 hover:border-slate-700 hover:bg-slate-900 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                        <Squares2X2Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-xs font-bold text-slate-100">تفاصيل المسارات والوظائف</span>
                        <span className="text-[10px] text-slate-400">Tracks & Job Profiles</span>
                      </div>
                    </div>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  </button>

                  {/* 🚪 Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-950/20 py-3 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="w-full rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
                >
                  تسجيل الدخول / حساب جديد
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}