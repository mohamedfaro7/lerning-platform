import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  BriefcaseIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Input from "../../component/common/Input";
import Button from "../../component/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../component/common/layout/JobsLayout";

// تعريف الخطوات (٣ خطوات)
const STEPS = [
  { key: "personal", icon: UserIcon, label: "البيانات الشخصية" },
  { key: "upload", icon: DocumentArrowUpIcon, label: "رفع الملفات والإقرار" },
  { key: "review", icon: CheckCircleIcon, label: "المراجعة النهائية" },
];

// قائمة الوظائف (للعرض)
const POSITIONS = [
  { id: "technical_manager", title: "مدير تقني", dept: "الهندسة", color: "#3b82f6" },
  { id: "track_head", title: "رئيس مسار برمجي", dept: "التعليم", color: "#a855f7" },
  { id: "academic_reviewer", title: "مراجع أكاديمي", dept: "المحتوى", color: "#06b6d4" },
  { id: "ops_planner", title: "مخطط عمليات", dept: "العمليات", color: "#10b981" },
  { id: "quality_reviewer", title: "مراجع جودة", dept: "المحتوى", color: "#f59e0b" },
  { id: "admin", title: "المشرف العام", dept: "الإدارة", color: "#ef4444" },
];

export default function JobsApply() {
  // جلب بيانات المستخدم والوظيفة المختارة من السياق
  const { user, pendingApplication } = useAuth();
  const { setActive } = useSidebar(); // للتحكم في التبويب النشط

  const [step, setStep] = useState(0);

  // State لرفع الملفات
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idBackFile, setIdBackFile] = useState(null);

  // State للإقرار
  const [isConfirmed, setIsConfirmed] = useState(false);

  // التنقل بين الخطوات
  const nextStep = () => {
    if (step === 1) {
      if (!cvFile || !photoFile || !idFrontFile || !idBackFile) {
        alert("من فضلك ارفع جميع الملفات المطلوبة (السيرة الذاتية، الصورة الشخصية، وجه البطاقة، ظهر البطاقة).");
        return;
      }
      if (!isConfirmed) {
        alert("يجب الموافقة على صحة البيانات قبل المتابعة.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  // ⭐ دالة الإرسال المعدلة
  const handleSubmit = () => {
    // التحقق النهائي (تأكيد)
    if (!cvFile || !photoFile || !idFrontFile || !idBackFile) {
      alert("جميع الملفات مطلوبة.");
      return;
    }
    if (!isConfirmed) {
      alert("يجب الموافقة على صحة البيانات.");
      return;
    }

    // تجميع البيانات النهائية
    const finalData = {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      idNumber: user?.idNumber || "",
      position: pendingApplication?.role || "",
      cv: cvFile,
      photo: photoFile,
      idFront: idFrontFile,
      idBack: idBackFile,
      confirmed: isConfirmed,
    };

    console.log("✅ البيانات النهائية المرسلة:", finalData);

    // 🚀 هنا سنرسل البيانات للـ API (لاحقاً)
    // حالياً، ننتقل إلى صفحة التتبع (Tracker) داخل نفس الـ Layout
    setActive("track"); // هذا سيغير المحتوى إلى ApplicationTracker

    // (اختياري) يمكن مسح بيانات النموذج أو إعادة تعيين الخطوات
    // لكن الأفضل تركها كما هي، لأن المستخدم لن يعود للخلف.
  };

  // ======== الهيكل الرئيسي ========
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* مؤشر الخطوات */}
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

      {/* حاوية المحتوى */}
      <div
        className="rounded-2xl border p-6 backdrop-blur-sm sm:p-8"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <AnimatePresence mode="wait">
          {/* الخطوة ٠: البيانات الشخصية (قراءة فقط) */}
          {step === 0 && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5"
            >
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                البيانات الشخصية والوظيفة
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                هذه البيانات مأخوذة من حسابك، يمكنك مراجعتها فقط.
              </p>

              {/* الاسم */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="w-full border-0 border-b-2 pb-2 text-base font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--border)", backgroundColor: "transparent" }}
                />
              </div>

              {/* البريد الإلكتروني */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full border-0 border-b-2 pb-2 text-base font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--border)", backgroundColor: "transparent" }}
                />
              </div>

              {/* رقم الجوال */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  value={user?.phone || "غير مضاف"}
                  readOnly
                  className="w-full border-0 border-b-2 pb-2 text-base font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--border)", backgroundColor: "transparent" }}
                />
              </div>

              {/* رقم البطاقة الشخصية */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  رقم البطاقة الشخصية
                </label>
                <input
                  type="text"
                  value={user?.idNumber || "غير مضاف"}
                  readOnly
                  className="w-full border-0 border-b-2 pb-2 text-base font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--border)", backgroundColor: "transparent" }}
                />
              </div>

              {/* الوظيفة المتقدم عليها */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  الوظيفة المتقدم عليها
                </label>
                <input
                  type="text"
                  value={POSITIONS.find((p) => p.id === pendingApplication?.role)?.title || "لم يتم الاختيار"}
                  readOnly
                  className="w-full border-0 border-b-2 pb-2 text-base font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--border)", backgroundColor: "transparent" }}
                />
              </div>
            </motion.div>
          )}

          {/* الخطوة ١: رفع الملفات والإقرار */}
          {step === 1 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5"
            >
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                رفع الملفات والإقرار
              </h3>

              {/* CV */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  السيرة الذاتية (CV) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, setCvFile)}
                  className="w-full rounded-xl border px-4 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                />
                {cvFile && <p className="text-xs text-green-500">✅ {cvFile.name}</p>}
              </div>

              {/* الصورة الشخصية */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  الصورة الشخصية <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setPhotoFile)}
                  className="w-full rounded-xl border px-4 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                />
                {photoFile && <p className="text-xs text-green-500">✅ {photoFile.name}</p>}
              </div>

              {/* وجه البطاقة */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  صورة البطاقة الشخصية (الوجه) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setIdFrontFile)}
                  className="w-full rounded-xl border px-4 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                />
                {idFrontFile && <p className="text-xs text-green-500">✅ {idFrontFile.name}</p>}
              </div>

              {/* ظهر البطاقة */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  صورة البطاقة الشخصية (الظهر) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setIdBackFile)}
                  className="w-full rounded-xl border px-4 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                />
                {idBackFile && <p className="text-xs text-green-500">✅ {idBackFile.name}</p>}
              </div>

              <hr className="my-2" style={{ borderColor: "var(--border)" }} />

              {/* Checkbox الإقرار */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="confirmCheck"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="h-5 w-5 accent-[var(--accent)]"
                />
                <label htmlFor="confirmCheck" className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  أقر بأن جميع البيانات المدخلة والملفات المرفوعة صحيحة
                  <span className="text-red-500">*</span>
                </label>
              </div>
            </motion.div>
          )}

          {/* الخطوة ٢: المراجعة النهائية */}
          {step === 2 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                المراجعة النهائية
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                راجع بياناتك جيداً قبل الإرسال.
              </p>

              {/* بطاقات البيانات الشخصية */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الاسم</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user?.name || "—"}</p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>البريد</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user?.email || "—"}</p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الجوال</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user?.phone || "—"}</p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>رقم البطاقة</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user?.idNumber || "—"}</p>
                </div>
              </div>

              {/* الوظيفة */}
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الوظيفة المتقدم عليها</p>
                <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {POSITIONS.find((p) => p.id === pendingApplication?.role)?.title || "—"}
                </p>
              </div>

              {/* الملفات المرفوعة */}
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الملفات المرفوعة</p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <li>📄 السيرة الذاتية: {cvFile?.name || "—"}</li>
                  <li>🖼️ الصورة الشخصية: {photoFile?.name || "—"}</li>
                  <li>🪪 وجه البطاقة: {idFrontFile?.name || "—"}</li>
                  <li>🪪 ظهر البطاقة: {idBackFile?.name || "—"}</li>
                </ul>
              </div>

              {/* الإقرار */}
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>حالة الإقرار</p>
                <p className="mt-1 text-sm font-medium text-green-500">
                  {isConfirmed ? "✅ تم الإقرار بصحة البيانات" : "❌ لم يتم الإقرار"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* أزرار التنقل */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={prevStep}
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
              onClick={nextStep}
              className="flex items-center gap-1 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "var(--accent)" }}
            >
              التالي
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isConfirmed}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all ${
                isConfirmed ? "hover:brightness-110" : "cursor-not-allowed opacity-50"
              }`}
              style={{ backgroundColor: isConfirmed ? "#10b981" : "#9ca3af" }}
            >
              <CheckCircleIcon className="h-4 w-4" />
              إرسال الطلب
            </button>
          )}
        </div>
      </div>
    </div>
  );
}