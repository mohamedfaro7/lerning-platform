import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightIcon,
  AcademicCapIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayCircleIcon,
  SparklesIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import StepIndicator from "../../component/common/enrollment/StepIndicator";
import {
  getStudentsByGroup,
  getAvailableSpots,
  CURRENCY,
} from "../../constants/mockLearningData";
import { useEnrollmentFlow } from "../../component/common/hooks/useEnrollmentFlow";

// ═══════════════════════════════════════════════════════════
//   Status Configuration
// ═══════════════════════════════════════════════════════════
const STATUS_CONFIG = {
  starting_soon: {
    key: "starting_soon",
    label: "هتكمل قريباً",
    emoji: "🔥",
    color: "#f59e0b",
    icon: ExclamationTriangleIcon,
    description: "باقي فيها أماكن قليلة — سارع بالحجز",
  },
  upcoming: {
    key: "upcoming",
    label: "لسه هتبدأ",
    emoji: "✨",
    color: "#6366f1",
    icon: SparklesIcon,
    description: "جروبات جديدة هتبدأ قريب — اختار اللي يناسبك",
  },
  active: {
    key: "active",
    label: "بدأت بالفعل",
    emoji: "▶️",
    color: "#10b981",
    icon: PlayCircleIcon,
    description: "جروبات شغالة فعلاً — تقدر تلتحق بالجلسات الجاية",
  },
};

const SECTION_ORDER = ["starting_soon", "upcoming", "active"];

// ═══════════════════════════════════════════════════════════
//   Helpers
// ═══════════════════════════════════════════════════════════
const formatTime = (time) => {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "مساءً" : "صباحاً";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ═══════════════════════════════════════════════════════════
//   Participant Avatars
// ═══════════════════════════════════════════════════════════
function ParticipantStack({ students, max = 5 }) {
  const visible = students.slice(0, max);
  const remaining = Math.max(0, students.length - max);

  if (students.length === 0) {
    return (
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        كن أول المنضمين ✨
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visible.map((s, i) => (
          <div
            key={s.id || i}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold text-white"
            style={{
              backgroundColor: `hsl(${(i * 47) % 360}, 60%, 45%)`,
              borderColor: "var(--card)",
              zIndex: max - i,
            }}
            title={s.name}
          >
            {s.avatar || s.name?.charAt(0) || "?"}
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
          +{remaining}
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Group Card
// ═══════════════════════════════════════════════════════════
function GroupCard({ group, isSelected, onSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const spotsLeft = getAvailableSpots(group);
  const isFull = spotsLeft <= 0;
  const occupancy = Math.round((group.enrolled / group.capacity) * 100);
  const students = useMemo(() => getStudentsByGroup(group.id), [group.id]);
  const status = STATUS_CONFIG[group.status] || STATUS_CONFIG.upcoming;

  const canSelect = !isFull;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => canSelect && onSelect(group)}
      className="relative overflow-hidden rounded-2xl border transition-all"
      style={{
        cursor: canSelect ? "pointer" : "not-allowed",
        borderColor: isSelected
          ? "var(--accent)"
          : isFull
          ? "rgba(244, 63, 94, 0.25)"
          : "var(--border)",
        backgroundColor: isSelected
          ? "color-mix(in srgb, var(--accent) 8%, var(--card))"
          : "var(--card)",
        boxShadow: isSelected
          ? "0 8px 24px color-mix(in srgb, var(--accent) 25%, transparent)"
          : "none",
        opacity: isFull ? 0.7 : 1,
      }}
    >
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-4 left-4 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <CheckCircleIcon className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              {group.nameAr}
            </h3>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {group.name}
            </p>
          </div>

          <span
            className="flex-shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold"
            style={{
              backgroundColor: isFull
                ? "rgba(244, 63, 94, 0.15)"
                : spotsLeft <= 3
                ? "rgba(245, 158, 11, 0.15)"
                : "rgba(16, 185, 129, 0.15)",
              color: isFull
                ? "#f43f5e"
                : spotsLeft <= 3
                ? "#f59e0b"
                : "#10b981",
            }}
          >
            {isFull ? "مكتمل" : spotsLeft <= 3 ? `${spotsLeft} أماكن` : "متاح"}
          </span>
        </div>

        {/* Schedule */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <CalendarDaysIcon
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            />
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                {group.days?.join(" و ") || "—"}
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {formatTime(group.startTime)} — {formatTime(group.endTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ClockIcon
              className="h-4 w-4 flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            />
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              تبدأ في {formatDate(group.startDate)}
            </p>
          </div>
        </div>

        {/* Participants */}
        <div className="mt-4 flex items-center justify-between">
          <ParticipantStack students={students} />
          <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
            {group.enrolled}/{group.capacity}
          </span>
        </div>

        {/* Occupancy bar */}
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--border)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${occupancy}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full"
            style={{
              backgroundColor: isFull
                ? "#f43f5e"
                : occupancy >= 60
                ? "#f59e0b"
                : "#10b981",
            }}
          />
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((p) => !p);
          }}
          className="mt-3 flex w-full items-center justify-center gap-1 text-[11px] font-semibold transition"
          style={{ color: "var(--text-muted)" }}
        >
          {isExpanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}
          <ChevronDownIcon
            className="h-3 w-3 transition-transform"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}
          />
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 space-y-2 border-t pt-3"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--text-muted)" }}>الجدول</span>
                  <span style={{ color: "var(--text-secondary)" }}>{group.schedule}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--text-muted)" }}>الحالة</span>
                  <span className="font-semibold" style={{ color: status.color }}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--text-muted)" }}>السعر</span>
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                    {group.price.toLocaleString()} {CURRENCY.symbol}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Section (per status)
// ═══════════════════════════════════════════════════════════
function GroupSection({ statusKey, groups, selectedGroupId, onSelect }) {
  const config = STATUS_CONFIG[statusKey];
  const StatusIcon = config.icon;

  if (groups.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            backgroundColor: config.color + "20",
            color: config.color,
          }}
        >
          <StatusIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2
            className="flex items-center gap-2 text-base font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {config.emoji} {config.label}
            <span
              className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
              style={{ backgroundColor: config.color + "20", color: config.color }}
            >
              {groups.length}
            </span>
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {config.description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            isSelected={selectedGroupId === group.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
//   Main Component
// ═══════════════════════════════════════════════════════════
export default function GroupSelection() {
  // ═══ كل حاجة من الـ hook — صفر منطق في الصفحة ═══
  const {
    course,
    instructor,
    courseId,
    availableGroups,
    provisionalGroupId,
    selectGroup,
    canProceed,
    validity,
    goToCheckout,
    back,
    requireAuth,
    isAuthenticated,
  } = useEnrollmentFlow();

  // ═══ Guards ═══
  if (!validity.courseValid) {
    return <Navigate to="/courses" replace />;
  }
  if (!validity.instructorValid) {
    return <Navigate to={`/courses/${courseId}/instructors`} replace />;
  }

  // ═══ تصنيف الجروبات (مشتق) ═══
  const grouped = useMemo(() => {
    return availableGroups.reduce((acc, g) => {
      const key = STATUS_CONFIG[g.status] ? g.status : "upcoming";
      (acc[key] ||= []).push(g);
      return acc;
    }, {});
  }, [availableGroups]);

  const selectedGroup = availableGroups.find(
    (g) => g.id === provisionalGroupId
  );

  // ═══ Handlers ═══
  const handleSelectGroup = (group) => selectGroup(group.id);

  const handleProceed = () => {
    // ⭐ لو مش مسجل → يفتح AuthModal (مش redirect لصفحة)
    if (!requireAuth()) return;
    // ✅ بعد login → يروح للدفع
    goToCheckout();
  };

  return (
    <div className="min-h-screen px-4 py-8 pb-32" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <StepIndicator currentStep={3} />

        {/* ═══ Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={back}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowRightIcon className="h-4 w-4" />
            العودة لاختيار المدرّس
          </button>

          {/* Instructor banner */}
          {instructor && (
            <div
              className="flex items-center gap-4 rounded-2xl border p-4"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <div
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, var(--accent), #8b5cf6)`,
                }}
              >
                {instructor.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  المدرّس المُختار
                </p>
                <h3
                  className="truncate text-base font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {instructor.name}
                </h3>
                <div className="mt-0.5 flex items-center gap-3">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {instructor.specialty}
                  </span>
                  <div className="flex items-center gap-1">
                    <StarSolid className="h-3 w-3 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">
                      {instructor.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="mt-6 text-center">
            <h1
              className="text-2xl font-black sm:text-3xl"
              style={{ color: "var(--text-primary)" }}
            >
              اختار <span style={{ color: "var(--accent)" }}>الجروب</span> المناسب
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {availableGroups.length} جروب متاح لكورس{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {course.titleAr || course.title}
              </span>
            </p>
          </div>
        </motion.div>

        {/* ═══ Content ═══ */}
        {availableGroups.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-12 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <AcademicCapIcon
              className="mx-auto h-12 w-12"
              style={{ color: "var(--text-muted)" }}
            />
            <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              المدرّس ده مش عنده جروبات متاحة للكورس ده حالياً.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <ArrowRightIcon className="h-4 w-4" />
              اختار مدرّس تاني
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {SECTION_ORDER.map((statusKey) => (
              <GroupSection
                key={statusKey}
                statusKey={statusKey}
                groups={grouped[statusKey] || []}
                selectedGroupId={provisionalGroupId}
                onSelect={handleSelectGroup}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ Sticky Bottom Bar ═══ */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "color-mix(in srgb, var(--bg) 95%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0 flex-1">
            {selectedGroup ? (
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent) 15%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    الجروب المختار
                  </p>
                  <p
                    className="truncate text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedGroup.nameAr}
                  </p>
                </div>
                <div className="mr-auto text-left">
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    الإجمالي
                  </p>
                  <p
                    className="text-base font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedGroup.price.toLocaleString()}{" "}
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {CURRENCY.symbol}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <UsersIcon className="h-4 w-4" />
                اختار جروب للاستمرار
              </div>
            )}
          </div>

          <button
            onClick={handleProceed}
            disabled={!canProceed}
            className="flex flex-shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: canProceed
                ? "0 4px 16px color-mix(in srgb, var(--accent) 30%, transparent)"
                : "none",
            }}
          >
            <SparklesIcon className="h-4 w-4" />
            {isAuthenticated ? "ادفع الآن" : "سجّل وادفع"}
          </button>
        </div>
      </div>
    </div>
  );
}