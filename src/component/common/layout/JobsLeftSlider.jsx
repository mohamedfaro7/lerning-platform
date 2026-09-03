import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  IdentificationIcon,
  PhoneIcon,
  CheckCircleIcon,
  SparklesIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";

export default function JobsLeftSlider({ isOpen, onClose }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleAuth = () => {
    openAuthModal();
    onClose();
  };

  const handleAiAssistant = () => {
    console.log("Opening AI Assistant...");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md"
          />

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
              <div className="h-1.5 w-10 rounded-full bg-slate-800 transition-colors group-hover:bg-slate-700" />
            </div>

            <div className="relative mb-5 flex items-center justify-between border-b border-slate-800/60 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 font-black text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                    {isAuthenticated ? (
                      user?.name?.charAt(0)?.toUpperCase() || "U"
                    ) : (
                      <SparklesIcon className="h-6 w-6 text-indigo-100" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-white tracking-wide">
                    {isAuthenticated ? user?.name || "مستخدم" : "مرحباً بك!"}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {isAuthenticated ? user?.email || "حساب شخصي" : "استكشف الفرص الوظيفية"}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 p-2 text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
              </button>
            </div>

            <div className="mb-4">
              <button
                onClick={handleAiAssistant}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 p-3.5 transition-all duration-300 hover:border-rose-500/60 hover:shadow-lg hover:shadow-rose-950/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <CpuChipIcon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
                      AI Assistant
                    </span>
                    <span className="text-[10px] text-slate-400">
                      مساعد الذكاء الاصطناعي
                    </span>
                  </div>
                </div>
                <ChevronLeftIcon className="h-4 w-4 text-slate-500 transition-transform group-hover:-translate-x-1 group-hover:text-rose-400" />
              </button>
            </div>

            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-300">حالة الحساب</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      نشط ومسجل
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5 transition-colors hover:bg-slate-900/80">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400">
                        <PhoneIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">رقم الجوال</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {user?.phone || "غير مضاف"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5 transition-colors hover:bg-slate-900/80">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400">
                        <IdentificationIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">رقم الهوية</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {user?.idNumber || "غير مضاف"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-950/20 py-3 text-xs font-bold text-rose-400 transition-all hover:border-rose-500/40 hover:bg-rose-600 hover:text-white"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-slate-900/40 p-4 text-center">
                    <p className="text-xs font-bold text-indigo-200">
                      انضم للفرص المتاحة
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                      سجل دخولك الآن للتقديم على الوظائف وتتبع حالة طلباتك بكل سهولة.
                    </p>
                  </div>

                  <button
                    onClick={handleAuth}
                    className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-indigo-400"
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    تسجيل الدخول / حساب جديد
                  </button>
                </>
              )}
            </div>

            <div className="mt-5 border-t border-slate-800/60 pt-3 text-center">
              <span className="text-[10px] font-medium text-slate-400">
                {isAuthenticated ? "جميع بياناتك محمية ومُشفَّرة" : "تصفح كزائر • خيارات محدودة"}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
