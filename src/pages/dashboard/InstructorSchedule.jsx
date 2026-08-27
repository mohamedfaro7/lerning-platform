import { motion } from "framer-motion";
import { CalendarIcon, ClockIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { MOCK_SCHEDULE, AVAILABLE_REPLACEMENT_DAYS } from "../../utils/mockSchedule";

export default function InstructorSchedule() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>الجدول الأسبوعي</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}> organisez vos cours et disponibilités</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>إضافة محاضرة</span>
        </button>
      </div>

      {/* Replacement Days Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-2xl border p-5 backdrop-blur-sm"
        style={{ borderColor: "#06b6d4", backgroundColor: "#06b6d410" }}
      >
        <div className="flex items-start gap-3">
          <CalendarIcon className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#06b6d4" }} />
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>أيام البدل المتاحة</p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              يمكنك تأجيل محاضرة عصرية واستبدالها بيوم بدل من الأيام التالية:{' '}
              {AVAILABLE_REPLACEMENT_DAYS.map((d, i) => (
                <span key={d} className="font-semibold" style={{ color: "#06b6d4" }}>
                  {d}{i < AVAILABLE_REPLACEMENT_DAYS.length - 1 ? '، ' : '.'}
                </span>
              ))}
            </p>
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
              يُسمح بالتطبيق لكل محاضرة مرة واحدة فقط، ويُحتسب للإجمالي.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Schedule Grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_SCHEDULE.map((slot, i) => (
          <motion.div
            key={`${slot.day}-${slot.time}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${slot.color}25` }}
            className="rounded-2xl border p-5 backdrop-blur-sm transition-all"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${slot.color}18`, color: slot.color }}>
                {slot.day}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                <ClockIcon className="h-3 w-3" />
                {slot.time}
              </span>
            </div>
            <h4 className="mt-3 font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>{slot.course}</h4>
            <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>{slot.students} طلاب</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
