import { motion } from "framer-motion";
import {
  FolderIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

export default function TrackCard({
  track,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onSelect(track.id)}
      className={`group cursor-pointer rounded-xl border p-4 transition-all ${
        isSelected
          ? "border-indigo-500/60 bg-indigo-950/30 shadow-lg shadow-indigo-500/10"
          : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* أيقونة + اسم المسار */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
              isSelected
                ? "bg-indigo-500/30 text-indigo-300"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            <FolderIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-bold truncate transition-colors ${
                isSelected ? "text-white" : "text-slate-200"
              }`}
            >
              {track.name}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">
              {track.jobs?.length || 0} وظيفة
            </p>
          </div>
        </div>

        {/* أزرار التحكم (تظهر عند الـ Hover أو لو محدد) */}
        <div
          className={`flex items-center gap-1 transition-opacity ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(track);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-indigo-400"
            title="تعديل"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(track);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-950/50 hover:text-rose-400"
            title="حذف"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* مؤشر السهم لو محدد */}
      {isSelected && (
        <div className="mt-3 flex items-center justify-end text-[10px] font-semibold text-indigo-400">
          محدد حالياً
          <ChevronLeftIcon className="h-3 w-3" />
        </div>
      )}
    </motion.div>
  );
}