import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, FolderPlusIcon } from "@heroicons/react/24/outline";

export default function AddTrackModal({ isOpen, onClose, onSave, editingTrack }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // ⭐ عند فتح النافذة، نملى البيانات لو كنا بنعدل
  useEffect(() => {
    if (isOpen) {
      setName(editingTrack?.name || "");
      setError("");
    }
  }, [isOpen, editingTrack]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();

    // Validation
    if (!trimmed) {
      setError("اسم المسار مطلوب");
      return;
    }
    if (trimmed.length < 3) {
      setError("الاسم يجب أن يكون ٣ أحرف على الأقل");
      return;
    }

    onSave({ name: trimmed });
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
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                  <FolderPlusIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {editingTrack ? "تعديل المسار" : "إضافة مسار جديد"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  اسم المسار <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="مثال: Full Stack Developer"
                  autoFocus
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                />
                {error && (
                  <p className="mt-2 text-xs font-medium text-rose-400">❌ {error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  {editingTrack ? "حفظ التعديلات" : "إضافة المسار"}
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