import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  BriefcaseIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import { DURATION_UNITS } from "../../../constants/mockTracks";
import SkillsInput from "./SkillsInput";

export default function AddJobModal({
  isOpen,
  onClose,
  onSave,
  editingJob,
  trackName,
}) {
  const [form, setForm] = useState({
    name: "",
    details: "",
    experienceYears: "",
    skills: [],
    durationValue: "",
    durationUnit: "days",
  });
  const [errors, setErrors] = useState({});

  // ⭐ عند فتح النافذة، نملى البيانات لو كنا بنعدل
  useEffect(() => {
    if (isOpen) {
      if (editingJob) {
        setForm({
          name: editingJob.name || "",
          details: editingJob.details || "",
          experienceYears: editingJob.experienceYears?.toString() || "",
          skills: editingJob.skills || [],
          durationValue: editingJob.duration?.value?.toString() || "",
          durationUnit: editingJob.duration?.unit || "days",
        });
      } else {
        setForm({
          name: "",
          details: "",
          experienceYears: "",
          skills: [],
          durationValue: "",
          durationUnit: "days",
        });
      }
      setErrors({});
    }
  }, [isOpen, editingJob]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "اسم الوظيفة مطلوب";
    if (form.name.trim().length < 3) newErrors.name = "الاسم ٣ أحرف على الأقل";
    if (!form.experienceYears || Number(form.experienceYears) < 0)
      newErrors.experienceYears = "سنين الخبرة مطلوبة (رقم موجب)";
    if (!form.durationValue || Number(form.durationValue) <= 0)
      newErrors.durationValue = "المدة مطلوبة (رقم موجب)";
    if (form.skills.length === 0) newErrors.skills = "أضف مهارة واحدة على الأقل";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: form.name.trim(),
      details: form.details.trim(),
      experienceYears: Number(form.experienceYears),
      skills: form.skills,
      duration: {
        value: Number(form.durationValue),
        unit: form.durationUnit,
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                  <BriefcaseIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingJob ? "تعديل الوظيفة" : "إضافة وظيفة جديدة"}
                  </h3>
                  {trackName && (
                    <p className="text-xs text-slate-500">
                      تحت مسار: {trackName}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ID (Auto-generated) */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <HashtagIcon className="h-4 w-4" />
                  معرف الوظيفة (ID)
                </label>
                <input
                  type="text"
                  value={editingJob?.id || "Auto-generated"}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/50 p-3 font-mono text-sm text-slate-500 focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-slate-600">
                  💡 يتم توليد هذا المعرف تلقائياً من السيرفر عند الحفظ
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  اسم الوظيفة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="مثال: Frontend Developer"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-400">❌ {errors.name}</p>
                )}
              </div>

              {/* Details */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  التفاصيل
                </label>
                <textarea
                  value={form.details}
                  onChange={(e) => handleChange("details", e.target.value)}
                  placeholder="اكتب وصف الوظيفة والمسؤوليات..."
                  rows="3"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              {/* Experience + Duration (Grid) */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Experience */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">
                    سنين الخبرة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.experienceYears}
                    onChange={(e) => handleChange("experienceYears", e.target.value)}
                    placeholder="مثال: 3"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.experienceYears && (
                    <p className="mt-1 text-xs text-rose-400">
                      ❌ {errors.experienceYears}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">
                    المدة <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={form.durationValue}
                      onChange={(e) => handleChange("durationValue", e.target.value)}
                      placeholder="30"
                      className="w-2/3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                    />
                    <select
                      value={form.durationUnit}
                      onChange={(e) => handleChange("durationUnit", e.target.value)}
                      className="w-1/3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    >
                      {DURATION_UNITS.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.durationValue && (
                    <p className="mt-1 text-xs text-rose-400">
                      ❌ {errors.durationValue}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  المهارات المطلوبة <span className="text-rose-500">*</span>
                </label>
                <SkillsInput
                  skills={form.skills}
                  onChange={(skills) => handleChange("skills", skills)}
                />
                {errors.skills && (
                  <p className="mt-1 text-xs text-rose-400">❌ {errors.skills}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-slate-800 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  {editingJob ? "حفظ التعديلات" : "إضافة الوظيفة"}
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