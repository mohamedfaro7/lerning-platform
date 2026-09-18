import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  StarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

export default function RateStudentModal({
  isOpen,
  onClose,
  onSave,
  student,
  group,
  existingRating,
}) {
  const [form, setForm] = useState({
    overallRating: 0,
    attendance: "",
    performance: 0,
    comment: "",
  });

  const [errors, setErrors] = useState({});

  // تحميل البيانات لو في تقييم موجود
  useEffect(() => {
    if (isOpen) {
      if (existingRating) {
        setForm({
          overallRating: existingRating.overallRating || 0,
          attendance: existingRating.attendance?.toString() || "",
          performance: existingRating.performance || 0,
          comment: existingRating.comment || "",
        });
      } else {
        setForm({
          overallRating: 0,
          attendance: "",
          performance: 0,
          comment: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, existingRating]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (form.overallRating === 0) newErrors.overallRating = "التقييم العام مطلوب";
    if (!form.comment.trim()) newErrors.comment = "الملاحظات مطلوبة";
    if (form.attendance && (Number(form.attendance) < 0 || Number(form.attendance) > 100)) {
      newErrors.attendance = "الحضور يجب أن يكون بين 0 و 100";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      studentId: student.id,
      groupId: group.id,
      overallRating: form.overallRating,
      attendance: form.attendance ? Number(form.attendance) : null,
      performance: form.performance || null,
      comment: form.comment.trim(),
    });
  };

  if (!student || !group) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                  {student.avatar}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {existingRating ? "تعديل التقييم" : "تقييم الطالب"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {student.name} • {group.nameAr}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="space-y-5 p-5">

              {/* التقييم العام */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  التقييم العام <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, overallRating: star });
                        if (errors.overallRating)
                          setErrors({ ...errors, overallRating: "" });
                      }}
                      className="transition hover:scale-110"
                    >
                      <StarIcon
                        className={`h-8 w-8 ${
                          star <= form.overallRating
                            ? "text-amber-400"
                            : "text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="mr-2 text-sm font-bold text-slate-300">
                    {form.overallRating > 0 && `${form.overallRating}/5`}
                  </span>
                </div>
                {errors.overallRating && (
                  <p className="mt-1 text-xs text-rose-400">❌ {errors.overallRating}</p>
                )}
              </div>

              {/* الحضور */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <ClockIcon className="h-4 w-4" />
                  نسبة الحضور (%)
                  <span className="text-xs text-slate-500">(اختياري)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.attendance}
                  onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                  placeholder="مثال: 85"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                />
                {errors.attendance && (
                  <p className="mt-1 text-xs text-rose-400">❌ {errors.attendance}</p>
                )}
              </div>

              {/* أداء الواجبات */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <AcademicCapIcon className="h-4 w-4" />
                  أداء الواجبات
                  <span className="text-xs text-slate-500">(اختياري)</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, performance: star })}
                      className="transition hover:scale-110"
                    >
                      <StarIcon
                        className={`h-7 w-7 ${
                          star <= form.performance
                            ? "text-indigo-400"
                            : "text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="mr-2 text-sm font-bold text-slate-300">
                    {form.performance > 0 && `${form.performance}/5`}
                  </span>
                </div>
              </div>

              {/* الملاحظات */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  ملاحظات <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={form.comment}
                  onChange={(e) => {
                    setForm({ ...form, comment: e.target.value });
                    if (errors.comment) setErrors({ ...errors, comment: "" });
                  }}
                  placeholder="اكتب ملاحظاتك عن الطالب..."
                  rows="3"
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                />
                {errors.comment && (
                  <p className="mt-1 text-xs text-rose-400">❌ {errors.comment}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-slate-800 pt-4">
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  {existingRating ? "حفظ التعديلات" : "حفظ التقييم"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-800"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}