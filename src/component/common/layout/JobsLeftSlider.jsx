import { useState } from "react";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  IdentificationIcon,
  PhoneIcon,
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

  return (
    <>
      {/* Floating Button - Bottom Left */}
      <button
        onClick={toggleSlider}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        style={{
          backgroundColor: "var(--accent)",
          color: "#fff",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
        aria-label={isAuthenticated ? "حسابي" : "تسجيل الدخول"}
      >
        {isAuthenticated ? (
          <span className="text-xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        ) : (
          <UserCircleIcon className="h-8 w-8" />
        )}
      </button>

      {/* Slider Panel */}
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity md:hidden"
            onClick={closeSlider}
          />

          <div
            className="fixed bottom-24 left-4 z-50 w-72 rounded-2xl border p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {isAuthenticated
                    ? user?.name?.charAt(0)?.toUpperCase() || "U"
                    : "?"}
                </div>
                <div>
                  <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
                    {isAuthenticated ? user?.name || "مستخدم" : "زائر"}
                  </p>
                  {isAuthenticated && (
                    <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                      {user?.email || ""}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeSlider}
                className="rounded-full p-1 transition-all hover:bg-[var(--surface-hover)]"
                style={{ color: "var(--text-muted)" }}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  {/* Status */}
                  <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                      الحالة
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-green-500">✅ مسجل الدخول</p>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1 rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-1.5">
                      <PhoneIcon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                      <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                        رقم الجوال
                      </p>
                    </div>
                    <input
                      type="text"
                      value={user?.phone || "غير مضاف"}
                      readOnly
                      className="w-full border-0 border-b border-[var(--border)] bg-transparent pb-1 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  {/* ID Number */}
                  <div className="flex flex-col gap-1 rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-1.5">
                      <IdentificationIcon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                      <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                        رقم البطاقة الشخصية
                      </p>
                    </div>
                    <input
                      type="text"
                      value={user?.idNumber || "غير مضاف"}
                      readOnly
                      className="w-full border-0 border-b border-[var(--border)] bg-transparent pb-1 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 py-2.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/10"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    تسجيل خروج
                  </button>
                </>
              ) : (
                <>
                  {/* Welcome Message */}
                  <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                      👋 مرحباً بك!
                    </p>
                    <p className="text-center text-[10px]" style={{ color: "var(--text-muted)" }}>
                      سجل دخولك لتتمكن من التقديم على الوظائف
                    </p>
                  </div>

                  {/* Phone Field (placeholder) */}
                  <div className="flex flex-col gap-1 rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-1.5">
                      <PhoneIcon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                      <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                        رقم الجوال
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="سيُطلب منك عند التسجيل"
                      className="w-full border-0 border-b border-[var(--border)] bg-transparent pb-1 text-sm font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent)]"
                      readOnly
                    />
                  </div>

                  {/* ID Number Field (placeholder) */}
                  <div className="flex flex-col gap-1 rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-1.5">
                      <IdentificationIcon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                      <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                        رقم البطاقة الشخصية
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="سيُطلب منك عند التسجيل"
                      className="w-full border-0 border-b border-[var(--border)] bg-transparent pb-1 text-sm font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent)]"
                      readOnly
                    />
                  </div>

                  {/* Login/Register Button */}
                  <button
                    onClick={handleAuth}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    تسجيل الدخول / إنشاء حساب
                  </button>
                </>
              )}
            </div>

            {/* Footer Note */}
            <p className="mt-4 text-center text-[9px]" style={{ color: "var(--text-muted)" }}>
              {isAuthenticated ? "يمكنك متابعة طلباتك من هنا" : "أنت تتصفح كزائر"}
            </p>
          </div>
        </>
      )}
    </>
  );
}