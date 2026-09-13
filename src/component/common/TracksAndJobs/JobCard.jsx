import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  AcademicCapIcon,
  HashtagIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { DURATION_UNITS } from "../../../constants/mockTracks";

// 🎨 عرض المدة بشكل جميل: 30 يوم / 4 أسابيع / 2 شهر
function formatDuration(duration) {
  if (!duration) return "—";
  const unit = DURATION_UNITS.find((u) => u.id === duration.unit);
  return `${duration.value} ${unit?.shortLabel || duration.unit}`;
}

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl transition-all hover:border-slate-700"
    >
      {/* Header: الاسم + أزرار التحكم */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <BriefcaseIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white truncate">
              {job.name}
            </h3>
            {/* ID - Auto-generated placeholder */}
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
              <HashtagIcon className="h-3 w-3" />
              <span className="font-mono">
                {job.id?.slice(0, 12) || "Auto-generated"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(job)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-indigo-400"
            title="تعديل"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(job)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-950/50 hover:text-rose-400"
            title="حذف"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Details */}
      {job.details && (
        <div className="mt-4 flex gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-slate-500 mt-0.5" />
          <p className="text-xs leading-relaxed text-slate-400 line-clamp-3">
            {job.details}
          </p>
        </div>
      )}

      {/* Meta Row: Experience + Duration */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-2">
          <AcademicCapIcon className="h-4 w-4 text-amber-400" />
          <div>
            <p className="text-[9px] text-slate-500">الخبرة</p>
            <p className="text-xs font-bold text-white">
              {job.experienceYears}+ سنوات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-2">
          <ClockIcon className="h-4 w-4 text-cyan-400" />
          <div>
            <p className="text-[9px] text-slate-500">المدة</p>
            <p className="text-xs font-bold text-white">
              {formatDuration(job.duration)}
            </p>
          </div>
        </div>
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold text-slate-500">
            المهارات المطلوبة
          </p>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}