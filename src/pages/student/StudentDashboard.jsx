import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  BanknotesIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChevronLeftIcon,
  TrophyIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useMyEnrollments } from "../../component/common/hooks/useMyEnrollments";
import { CURRENCY } from "../../constants/mockLearningData";

// ═══════════════════════════════════════════════════════════
//   Helpers
// ═══════════════════════════════════════════════════════════
const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "مساءً" : "صباحاً";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const formatRelativeDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (24 * 60 * 60 * 1000));

  if (diff === 0) return "اليوم";
  if (diff === 1) return "غداً";
  if (diff === 2) return "بعد غد";
  if (diff < 0) return "فات";
  return `بعد ${diff} أيام`;
};

// ═══════════════════════════════════════════════════════════
//   KPI Card
// ═══════════════════════════════════════════════════════════
function KpiCard({ icon: Icon, label, value, accent, suffix }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${accent}20`,
            color: accent,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {label}
          </p>
          <p
            className="mt-0.5 text-xl font-black"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
            {suffix && (
              <span
                className="mr-1 text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {suffix}
              </span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Upcoming Session Card
// ═══════════════════════════════════════════════════════════
function UpcomingSessionRow({ session, index }) {
  const relative = formatRelativeDate(session.date);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 rounded-xl border p-3 transition hover:border-[var(--accent)]"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      {/* Date badge */}
      <div
        className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl"
        style={{
          backgroundColor: session.isToday
            ? "color-mix(in srgb, var(--accent) 15%, transparent)"
            : "color-mix(in srgb, var(--bg) 60%, transparent)",
          color: session.isToday ? "var(--accent)" : "var(--text-primary)",
        }}
      >
        <span className="text-[10px] font-bold">
          {session.dayName}
        </span>
        <span className="mt-0.5 text-xs font-bold">{relative}</span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {session.course.titleAr || session.course.title}
        </p>
        <div className="mt-0.5 flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            {formatTime(session.startTime)}
          </span>
          <span className="truncate">{session.group.nameAr}</span>
        </div>
      </div>

      {/* Instructor */}
      {session.instructor && (
        <div className="hidden items-center gap-2 sm:flex">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{
              background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
            }}
          >
            {session.instructor.avatar}
          </div>
          <span
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {session.instructor.name}
          </span>
        </div>
      )}

      {/* Join */}
      <button
        className="flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition hover:brightness-110"
        style={{
          backgroundColor: session.isToday ? "var(--accent)" : "transparent",
          color: session.isToday ? "#fff" : "var(--text-secondary)",
          border: session.isToday ? "none" : "1px solid var(--border)",
        }}
      >
        <PlayCircleIcon className="inline h-3.5 w-3.5" />
        <span className="mr-1">ادخل</span>
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Enrollment Card
// ═══════════════════════════════════════════════════════════
function EnrollmentCard({ enrollment, index }) {
  const { course, group, instructor } = enrollment;
  const occupancy = Math.round((group.enrolled / group.capacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl border transition-all hover:-translate-y-1"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      {/* Header band */}
      <div
        className="relative h-28 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, var(--accent) 25%, transparent), rgba(168, 85, 247, 0.2))`,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-10 -left-10 h-32 w-32 rounded-full blur-3xl"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 40%, transparent)" }}
        />
        <div className="relative flex h-full items-center justify-between p-4">
          <div
            className="rounded-lg px-2.5 py-1 text-[10px] font-bold"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "#fff",
              backdropFilter: "blur(8px)",
            }}
          >
            {group.status === "active" ? "▶️ نشط" :
             group.status === "starting_soon" ? "🔥 قريباً" : "✨ لم يبدأ"}
          </div>
          <Link
            to={`/courses/${course.id}`}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-white/20"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
          >
            التفاصيل
            <ChevronLeftIcon className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="p-5">
        {/* Title */}
        <h3
          className="line-clamp-2 text-base font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {course.titleAr || course.title}
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
          {group.nameAr}
        </p>

        {/* Instructor */}
        {instructor && (
          <div className="mt-4 flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
              }}
            >
              {instructor.avatar}
            </div>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {instructor.name}
            </span>
          </div>
        )}

        {/* Schedule */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <CalendarDaysIcon className="h-3.5 w-3.5" />
            <span>{group.days?.join(" و ") || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <ClockIcon className="h-3.5 w-3.5" />
            <span>
              {formatTime(group.startTime)} — {formatTime(group.endTime)}
            </span>
          </div>
        </div>

        {/* Classmates progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <UserGroupIcon className="h-3 w-3" />
              {group.enrolled} زميل
            </span>
            <span className="font-bold" style={{ color: "var(--accent)" }}>
              {occupancy}% ممتلئ
            </span>
          </div>
          <div
            className="mt-1.5 h-1.5 overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${occupancy}%`,
                backgroundColor: "var(--accent)",
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition hover:brightness-110"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <PlayCircleIcon className="h-4 w-4" />
            ادخل الجلسة
          </button>
          <button
            className="flex items-center justify-center rounded-xl border px-3 py-2.5 transition"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
            title="المواد التعليمية"
          >
            <DocumentTextIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Empty State
// ═══════════════════════════════════════════════════════════
function EmptyState({ tab }) {
  const messages = {
    active: {
      title: "مفيش كورسات نشطة",
      desc: "ابدأ رحلتك التعليمية بالالتحاق بكورس جديد.",
    },
    upcoming: {
      title: "مفيش كورسات قادمة",
      desc: "سجل في كورس جديد وهيظهر هنا قبل ما يبدأ.",
    },
    completed: {
      title: "مفيش كورسات مكتملة",
      desc: "لسه مخلصتش أي كورس. شد حيلك! 💪",
    },
  };
  const m = messages[tab] || messages.active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dashed p-12 text-center"
      style={{ borderColor: "var(--border)" }}
    >
      <BookOpenIcon
        className="mx-auto h-14 w-14"
        style={{ color: "var(--text-muted)" }}
      />
      <h3
        className="mt-4 text-lg font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        {m.title}
      </h3>
      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        {m.desc}
      </p>
      <Link
        to="/courses"
        className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
        style={{ backgroundColor: "var(--accent)" }}
      >
        <SparklesIcon className="h-4 w-4" />
        استكشف الكورسات
      </Link>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Tabs
// ═══════════════════════════════════════════════════════════
const TABS = [
  { key: "active", label: "النشطة", icon: PlayCircleIcon },
  { key: "upcoming", label: "القادمة", icon: SparklesIcon },
  { key: "completed", label: "المكتملة", icon: TrophyIcon },
];

function TabBar({ active, onChange, counts }) {
  return (
    <div
      className="flex gap-1 rounded-2xl border p-1"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const count = counts[tab.key] || 0;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition"
            style={{
              color: isActive ? "#fff" : "var(--text-secondary)",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: "var(--accent)" }}
                transition={{ type: "spring", duration: 0.4 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {count > 0 && (
                <span
                  className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.2)"
                      : "color-mix(in srgb, var(--accent) 15%, transparent)",
                    color: isActive ? "#fff" : "var(--accent)",
                  }}
                >
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Main Component
// ═══════════════════════════════════════════════════════════
export default function StudentDashboard() {
  const { user } = useAuth();
  const { categorized, upcomingSessions, stats } = useMyEnrollments();
  const [activeTab, setActiveTab] = useState("active");

  const currentList = categorized[activeTab] || [];
  const counts = {
    active: categorized.active.length,
    upcoming: categorized.upcoming.length,
    completed: categorized.completed.length,
  };

  const displayName = user?.name || "صديقنا";

  return (
    <div className="min-h-screen px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-6xl">

        {/* ═══ Welcome Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border p-6 sm:p-8"
          style={{
            borderColor: "var(--border)",
            background:
              "linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--accent) 8%, transparent) 100%)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-20 -left-20 h-48 w-48 rounded-full blur-3xl"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)" }}
          />

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
                }}
              >
                {displayName.charAt(0)}
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  أهلاً بيك 👋
                </p>
                <h1
                  className="text-xl font-black sm:text-2xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  {displayName}
                </h1>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {stats.totalCourses > 0
                    ? `عندك ${stats.activeGroups} كورس نشط`
                    : "ابدأ رحلتك التعليمية النهاردة"}
                </p>
              </div>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <SparklesIcon className="h-4 w-4" />
              استكشف كورسات
            </Link>
          </div>
        </motion.div>

        {/* ═══ KPI Cards ═══ */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={BookOpenIcon}
            label="الكورسات المسجلة"
            value={stats.totalCourses}
            accent="#6366f1"
          />
          <KpiCard
            icon={PlayCircleIcon}
            label="جروبات نشطة"
            value={stats.activeGroups}
            accent="#10b981"
          />
          <KpiCard
            icon={CalendarDaysIcon}
            label="جلسات قادمة"
            value={stats.upcomingSessions}
            accent="#f59e0b"
          />
          <KpiCard
            icon={BanknotesIcon}
            label="إجمالي مدفوع"
            value={stats.totalSpent.toLocaleString()}
            suffix={CURRENCY.symbol}
            accent="#06b6d4"
          />
        </div>

        {/* ═══ Upcoming Sessions ═══ */}
        {upcomingSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="flex items-center gap-2 text-base font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                <CalendarDaysIcon className="h-5 w-5 text-amber-400" />
                الجلسات القادمة
              </h2>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {upcomingSessions.length} جلسة
              </span>
            </div>

            <div className="space-y-2">
              {upcomingSessions.map((session, i) => (
                <UpcomingSessionRow key={session.id} session={session} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ My Courses ═══ */}
        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2
              className="flex items-center gap-2 text-base font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              <AcademicCapIcon className="h-5 w-5 text-indigo-400" />
              كورساتي
            </h2>

            <div className="w-full sm:w-auto sm:min-w-[420px]">
              <TabBar active={activeTab} onChange={setActiveTab} counts={counts} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentList.length === 0 ? (
                <EmptyState tab={activeTab} />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {currentList.map((enr, i) => (
                    <EnrollmentCard key={enr.id} enrollment={enr} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═══ Footer note ═══ */}
        {stats.totalCourses > 0 && (
          <p
            className="mt-10 text-center text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            محتاج مساعدة؟{" "}
            <Link
              to="/contact"
              className="font-semibold underline"
              style={{ color: "var(--accent)" }}
            >
              تواصل مع الدعم
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}