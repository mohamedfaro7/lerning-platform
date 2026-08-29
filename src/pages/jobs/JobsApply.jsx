import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  BriefcaseIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
  PhotoIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import Input from "../../component/common/Input";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../component/common/layout/JobsLayout";

// تعريف الخطوات الجديدة (بقينا ٣ خطوات بس)
const STEPS = [
  { key: "personal", icon: UserIcon, label: "البيانات والوظيفة" },
  { key: "upload", icon: CloudArrowUpIcon, label: "رفع الملفات والإقرار" },
  { key: "review", icon: CheckCircleIcon, label: "المراجعة النهائية" },
];

export default function JobsApply() {
  // ١. جلب بيانات المستخدم والوظيفة المختارة من الـ Context
  const { user, pendingApplication } = useAuth();
  
  // ٢. حالة الخطوات والشاشات
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // ٣. حالات رفع الملفات (كل ملف له State لوحده)
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idBackFile, setIdBackFile] = useState(null);

  // ٤. حالة الـ Checkbox (الموافقة على صحة البيانات)
  const [isConfirmed, setIsConfirmed] = useState(false);

  // ٥. دوال الانتقال بين الخطوات
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // ٦. دوال رفع الملفات (بتخزن الـ File Object في الـ State)
  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  // ٧. دالة الإرسال النهائية (هتلم كل حاجة)
  const handleSubmit = () => {
    // تجميع البيانات النهائية (النصوص + الملفات)
    const finalData = {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "غير مضاف",
      position: pendingApplication?.title || "غير محدد",
      cv: cvFile,
      photo: photoFile,
      idFront: idFrontFile,
      idBack: idBackFile,
      isConfirmed: isConfirmed,
    };

    console.log("✅ البيانات النهائية المرسلة:", finalData);

    // هنعمل هنا After successful API call:
    setSubmitted(true);
  };

  // لو تم الإرسال بنجاح، نعرض رسالة الشكر
  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircleIcon className="mx-auto h-16 w-16" style={{ color: "#10b981" }} />
          <h2 className="mt-4 font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            تم إرسال طلبك بنجاح!
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            سنتواصل معك قريباً. شكراً لاهتمامك بالانضمام لفريق أكاديمي.
          </p>
        </motion.div>
      </div>
    );
  }

  // حساب شرط تمكين زر "التالي" في الخطوة ٢ (كل الملفات مرفوعة + الـ Checkbox متظبط)
  const isUploadStepValid = cvFile && photoFile && idFrontFile && idBackFile && isConfirmed;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* مؤشر الخطوات (Step Indicator) */}
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

      {/* محتوى الخطوات */}
      <div
        className="rounded-2xl border p-6 backdrop-blur-sm sm:p-8"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <AnimatePresence mode="wait">
          {/* ========== الخطوة ١: البيانات الشخصية والوظيفة ========== */}
          {step === 0 && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                البيانات الشخصية والوظيفة المختارة
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                هذه البيانات مأخوذة من حسابك ولا يمكن تعديلها.
              </p>

              {/* الاسم - مقفول */}
              <Input
                name="name"
                placeholder="الاسم الكامل"
                value={user?.name || ""}
                disabled
                className="cursor-not-allowed opacity-70"
                style={{
               backgroundColor: "#e5e7eb", // لون ثابت مش متغير
                   color: "#111827",
                 WebkitTextFillColor: "#111827",
                                      }}

              />
              {/* الإيميل - مقفول */}
              <Input
                name="email"
                type="email"
                placeholder="البريد الإلكتروني"
                value={user?.email || ""}
                disabled
                className="cursor-not-allowed opacity-70"
                style={{
  backgroundColor: "#e5e7eb", // لون ثابت مش متغير
  color: "#111827",
  WebkitTextFillColor: "#111827",
}}

              />
              {/* رقم الجوال - مقفول */}
              <Input
                name="phone"
                type="tel"
                placeholder="رقم الجوال"
                value={user?.phone || "لم يتم إضافة رقم جوال"}
                disabled
                className="cursor-not-allowed opacity-70"
               style={{
  backgroundColor: "#e5e7eb", // لون ثابت مش متغير
  color: "#111827",
  WebkitTextFillColor: "#111827",
}}
              />
              {/* الوظيفة المختارة - مقفول وجاية من pendingApplication */}
              <Input
                name="position"
                placeholder="الوظيفة المقدّم عليها"
                value={pendingApplication?.title || "لم يتم اختيار وظيفة"}
                disabled
                className="cursor-not-allowed opacity-70"
               style={{
  backgroundColor: "#e5e7eb", // لون ثابت مش متغير
  color: "#111827",
  WebkitTextFillColor: "#111827",
}}
              />
            </motion.div>
          )}

          {/* ========== الخطوة ٢: رفع الملفات والإقرار ========== */}
          {step === 1 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5"
            >
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                رفع المستندات والإقرار
              </h3>

              {/* رفع السيرة الذاتية CV */}
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  السيرة الذاتية (CV) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, setCvFile)}
                  className="w-full cursor-pointer rounded-xl border p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                  style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                />
                {cvFile && <p className="mt-1 text-xs" style={{ color: "#10b981" }}>✅ تم رفع: {cvFile.name}</p>}
              </div>

              {/* رفع الصورة الشخصية */}
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  الصورة الشخصية <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setPhotoFile)}
                  className="w-full cursor-pointer rounded-xl border p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                  style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                />
                {photoFile && <p className="mt-1 text-xs" style={{ color: "#10b981" }}>✅ تم رفع: {photoFile.name}</p>}
              </div>

              {/* رفع صورة البطاقة (وجه) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  صورة البطاقة الشخصية (الوجه) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setIdFrontFile)}
                  className="w-full cursor-pointer rounded-xl border p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                  style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                />
                {idFrontFile && <p className="mt-1 text-xs" style={{ color: "#10b981" }}>✅ تم رفع: {idFrontFile.name}</p>}
              </div>

              {/* رفع صورة البطاقة (ظهر) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  صورة البطاقة الشخصية (الظهر) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setIdBackFile)}
                  className="w-full cursor-pointer rounded-xl border p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                  style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                />
                {idBackFile && <p className="mt-1 text-xs" style={{ color: "#10b981" }}>✅ تم رفع: {idBackFile.name}</p>}
              </div>

              {/* الـ Checkbox الإلزامي */}
              <div className="mt-2 flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                <input
                  type="checkbox"
                  id="confirm"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-1 h-5 w-5 cursor-pointer rounded accent-[var(--accent)]"
                />
                <label htmlFor="confirm" className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  أقر بأن جميع البيانات المدخلة والمستندات المرفوعة <strong>صحيحة وكاملة</strong>، وأتحمل المسؤولية الكاملة عنها.
                </label>
              </div>
            </motion.div>
          )}

          {/* ========== الخطوة ٣: المراجعة النهائية ========== */}
          {step === 2 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                راجع طلبك قبل الإرسال
              </h3>

              {/* البيانات الشخصية */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الاسم</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user?.name || "—"}</p>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الإيميل</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user?.email || "—"}</p>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>رقم الجوال</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user?.phone || "—"}</p>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>الوظيفة</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{pendingApplication?.title || "—"}</p>
                </div>
              </div>

              {/* الملفات المرفوعة */}
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>المستندات المرفوعة</p>
                <ul className="mt-2 flex flex-col gap-1 text-sm" style={{ color: "var(--text-primary)" }}>
                  <li>📄 السيرة الذاتية: {cvFile ? cvFile.name : "❌ غير مرفوع"}</li>
                  <li>🖼️ الصورة الشخصية: {photoFile ? photoFile.name : "❌ غير مرفوع"}</li>
                  <li>🪪 البطاقة (وجه): {idFrontFile ? idFrontFile.name : "❌ غير مرفوع"}</li>
                  <li>🪪 البطاقة (ظهر): {idBackFile ? idBackFile.name : "❌ غير مرفوع"}</li>
                </ul>
              </div>

              {/* حالة الإقرار */}
              <div className="rounded-xl border p-4" style={{ borderColor: isConfirmed ? "#10b981" : "var(--border)" }}>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>حالة الإقرار</p>
                <p className="mt-1 text-sm font-medium" style={{ color: isConfirmed ? "#10b981" : "var(--text-muted)" }}>
                  {isConfirmed ? "✅ تم الإقرار بصحة البيانات" : "❌ لم يتم الإقرار بعد"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== أزرار التنقل ========== */}
        <div className="mt-8 flex items-center justify-between">
          {/* زر السابق */}
          {step > 0 ? (
            <button
              onClick={prev}
              className="flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium transition-all hover:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <ChevronRightIcon className="h-4 w-4" />
              السابق
            </button>
          ) : (
            <div />
          )}

          {/* زر التالي / الإرسال */}
          {step < STEPS.length - 1 ? (
            // في الخطوة ٢ (رفع الملفات)، الزر مش هيتفعل غير لما كل الشروط تتحقق
            <button
              onClick={next}
              disabled={step === 1 && !isUploadStepValid}
              className={`flex items-center gap-1 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all ${
                step === 1 && !isUploadStepValid
                  ? "cursor-not-allowed opacity-50"
                  : "hover:brightness-110"
              }`}
              style={{ backgroundColor: "var(--accent)" }}
            >
              التالي
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          ) : (
            // زر الإرسال النهائي (في الخطوة ٣)
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "#10b981" }}
            >
              <CheckCircleIcon className="h-4 w-4" />
              تقديم الطلب (Apply)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}