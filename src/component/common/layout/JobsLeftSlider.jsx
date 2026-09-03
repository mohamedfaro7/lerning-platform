import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  IdentificationIcon,
  PhoneIcon,
  CheckCircleIcon,
  SparklesIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";

export default function JobsLeftSlider() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSlider = () => setIsOpen(!isOpen);
  const closeSlider = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeSlider();
  };

  const handleAuth = () => {
    openAuthModal();
    closeSlider();
  };

  const handleAiAssistant = () => {
    console.log("Opening AI Assistant...");
    closeSlider();
  };

  return (
    <>
      {/* 🔘 Floating Dark Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSlider}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 ring-1 ring-indigo-400/30 backdrop-blur-md transition-all hover:bg-indigo-500"
        aria-label={isAuthenticated ? "حسابي" : "تسجيل الدخول"}
      >
        {isAuthenticated ? (
          <div className="relative flex items-center justify-center">
            <span className="text-lg font-black tracking-wider text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
          </div>
        ) : (
          <UserCircleIcon className="h-7 w-7 text-indigo-100" />
        )}
      </motion.button>

      {/* 🗂️ Dark Slide Panel & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSlider}
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Dark Card Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 left-4 z-50 w-80 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 p-5 text-slate-100 shadow-2xl backdrop-blur-2xl dir-rtl"
              dir="rtl"
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 font-bold text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400/20">
                    {isAuthenticated ? (
                      user?.name?.charAt(0)?.toUpperCase() || "U"
                    ) : (
                      <SparklesIcon className="h-5 w-5 text-indigo-200" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-white">
                      {isAuthenticated ? user?.name || "مستخدم" : "مرحباً بك! 👋"}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {isAuthenticated ? user?.email || "حساب شخصي" : "زائر جديد"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeSlider}
                  className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* 🤖 Dark AI Assistant Item */}
              <div className="mb-3">
                <button
                  onClick={handleAiAssistant}
                  className="group flex w-full items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-950/30 p-3 transition-all hover:border-rose-500/50 hover:bg-rose-900/40"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                      <CpuChipIcon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-rose-300">
                      AI Assistant
                    </span>
                  </div>
                  <span className="rounded-lg bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                    مساعد الذكاء الاصطناعي
                  </span>
                </button>
              </div>

              {/* Content Section */}
              <div className="space-y-2.5">
                {isAuthenticated ? (
                  <>
                    {/* Status Badge */}
                    <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3">
                      <span className="text-xs font-bold text-slate-400">حالة الحساب</span>
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircleIcon className="h-3.5 w-3.5" />
                        نشط ومسجل
                      </span>
                    </div>

                    {/* Phone Number Item */}
                    <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-1.5 text-slate-400">
                          <PhoneIcon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400">رقم الجوال</span>
                          <span className="text-xs font-bold text-slate-200">
                            {user?.phone || "غير مضاف"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ID Card Item */}
                    <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-1.5 text-slate-400">
                          <IdentificationIcon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400">
                            رقم الهوية
                          </span>
                          <span className="text-xs font-bold text-slate-200">
                            {user?.idNumber || "غير مضاف"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dark Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-950/30 py-2.5 text-xs font-bold text-rose-400 transition-all hover:bg-rose-600 hover:text-white"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      تسجيل الخروج (Logout)
                    </button>
                  </>
                ) : (
                  <>
                    {/* Guest Welcome Banner */}
                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/30 p-3.5 text-center">
                      <p className="text-xs font-bold text-indigo-200">
                        استكشف الفرص المتاحة
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        سجل دخولك لتتمكن من التقديم على الوظائف وتتبع طلباتك.
                      </p>
                    </div>

                    {/* Login Action Button */}
                    <button
                      onClick={handleAuth}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500"
                    >
                      <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                      تسجيل الدخول / حساب جديد
                    </button>
                  </>
                )}
              </div>

              {/* Dark Footer Note */}
              <div className="mt-4 border-t border-slate-800/80 pt-3 text-center">
                <span className="text-[10px] font-medium text-slate-400">
                  {isAuthenticated ? "جميع بياناتك محمية ومشفرة" : "تصفح كزائر • خيارات محدودة"}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}