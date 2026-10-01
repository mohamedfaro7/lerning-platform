import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenIcon,
  ClockIcon,
  AcademicCapIcon,
  UsersIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  TrophyIcon,
  ChevronDownIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import {
  MOCK_COURSES,
  MOCK_INSTRUCTORS,
  MOCK_GROUPS,
  CURRENCY,
  getGroupsByInstructor,
} from "../constants/mockLearningData";
import { useAuth } from "../context/AuthContext";

// ═══════════════════════════════════════════════════════════
//   Sub-Components
// ═══════════════════════════════════════════════════════════

function GroupCard({ group, index, onEnroll }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const occupancy = Math.round((group.enrolled / group.capacity) * 100);
  const isFull = group.enrolled >= group.capacity;
  const spotsLeft = group.capacity - group.enrolled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border transition-all"
      style={{
        borderColor: isFull ? "rgba(244, 63, 94, 0.3)" : "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      {/* Glow Effect */}
      <div
        className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: isFull
            ? "rgba(244, 63, 94, 0.2)"
            : "rgba(99, 102, 241, 0.2)",
        }}
      />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="text-base font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {group.nameAr}
            </h3>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {group.schedule}
            </p>
          </div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.08 + 0.3, type: "spring" }}
            className={`flex-shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold ${
              isFull
                ? "bg-rose-500/20 text-rose-400"
                : spotsLeft <= 3
                ? "bg-amber-500/20 text-amber-400"
                : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {isFull ? "مكتمل" : spotsLeft <= 3 ? `${spotsLeft} أماكن` : "متاح"}
          </motion.span>
        </div>

        {/* Occupancy Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "var(--text-secondary)" }}>
              {group.enrolled}/{group.capacity} طالب
            </span>
            <span
              className="font-bold"
              style={{
                color: isFull
                  ? "#f43f5e"
                  : occupancy >= 60
                  ? "#f59e0b"
                  : "#10b981",
              }}
            >
              {occupancy}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${occupancy}%` }}
              transition={{ duration: 1, delay: index * 0.08 + 0.2 }}
              className={`h-full rounded-full ${
                isFull
                  ? "bg-gradient-to-r from-rose-500 to-rose-600"
                  : occupancy >= 60
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500"
              }`}
            />
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-2">
          <span
            className="text-xl font-black"
            style={{ color: "var(--text-primary)" }}
          >
            {group.price.toLocaleString()}
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {CURRENCY.symbol}
          </span>
        </div>

        {/* Enroll Button */}
        <button
          onClick={() => onEnroll(group)}
          disabled={isFull}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
            isFull
              ? "cursor-not-allowed bg-slate-800 text-slate-500"
              : "text-white hover:brightness-110 active:scale-[0.98]"
          }`}
          style={
            !isFull
              ? {
                  background:
                    "linear-gradient(135deg, var(--accent), #8b5cf6)",
                  boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
                }
              : {}
          }
        >
          {isFull ? (
            <>
              <span>الجروب مكتمل</span>
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              <span>سجل الآن</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Main Component
// ═══════════════════════════════════════════════════════════
export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const course = useMemo(
    () => MOCK_COURSES.find((c) => c.id === id),
    [id]
  );

  const { instructor, groups, totalEnrolled, instructorRating } = useMemo(() => {
    if (!course)
      return {
        instructor: null,
        groups: [],
        totalEnrolled: 0,
        instructorRating: 0,
      };
    const inst = MOCK_INSTRUCTORS.find((i) => i.id === course.instructorId);
    const grps = MOCK_GROUPS.filter((g) => g.courseId === course.id);
    const enrolled = grps.reduce((sum, g) => sum + g.enrolled, 0);
    return {
      instructor: inst,
      groups: grps,
      totalEnrolled: enrolled,
      instructorRating: inst?.rating || 0,
    };
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10">
            <BookOpenIcon className="h-10 w-10 text-rose-400" />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            الكورس غير موجود
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            الرابط قد يكون غير صحيح أو تم حذف الكورس.
          </p>
          <Link
            to="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <ArrowRightIcon className="h-4 w-4" />
            العودة للكورسات
          </Link>
        </motion.div>
      </div>
    );
  }
const handleEnroll = (group) => {
  if (!isAuthenticated) {
    // ⭐ يروح لصفحة تسجيل الدخول مع تمرير رابط الرجوع
    navigate("/login", {
      state: { returnTo: `/courses/${course.id}` },
    });
    return;
  }
  // TODO: فتح EnrollmentModal
  alert(`سيتم فتح نافذة الدفع للتسجيل في: ${group.nameAr}`);
};

  const sectionLabel =
    course.sectionId === "english" ? "English" : "Programming";

  const totalSpots = groups.reduce((sum, g) => sum + g.capacity, 0);
  const availableSpots = totalSpots - totalEnrolled;

  return (
    <div className="min-h-screen py-8 px-4" dir="rtl">
      <div className="mx-auto max-w-6xl">

        {/* ═══ Breadcrumb ═══ */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center gap-2 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <Link to="/" className="transition hover:opacity-80">
            الرئيسية
          </Link>
          <span>/</span>
          <Link to="/courses" className="transition hover:opacity-80">
            الكورسات
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>
            {course.titleAr || course.title}
          </span>
        </motion.nav>

        {/* ═══ Hero Section ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 lg:p-10"
          style={{
            borderColor: "var(--border)",
            background:
              "linear-gradient(135deg, var(--card) 0%, rgba(99, 102, 241, 0.08) 100%)",
          }}
        >
          {/* Animated Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"
          />

          <div className="relative">
            {/* Badges */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className="rounded-lg px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  color: "#818cf8",
                }}
              >
                {sectionLabel}
              </span>
              <span
                className="rounded-lg px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                }}
              >
                {course.level}
              </span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                }}
              >
                <TrophyIcon className="h-3.5 w-3.5" />
                شهادة معتمدة
              </motion.span>
            </div>

            {/* Title */}
            <h1
              className="font-display text-2xl font-black leading-tight sm:text-3xl lg:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              {course.titleAr || course.title}
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {course.title}
            </p>

            {/* Meta Stats */}
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15">
                  <UsersIcon className="h-4 w-4 text-indigo-400" />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {totalEnrolled} طالب
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
                  <ClockIcon className="h-4 w-4 text-purple-400" />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {course.duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15">
                  <PlayCircleIcon className="h-4 w-4 text-cyan-400" />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {groups.length} جروب متاح
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                  <AcademicCapIcon className="h-4 w-4 text-emerald-400" />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {availableSpots} مكان متاح
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Main Grid: Content + Sidebar ═══ */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ═══ Left: Content ═══ */}
          <div className="space-y-6">

            {/* Course Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border p-6"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <h2
                className="flex items-center gap-2 text-base font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                <DocumentTextIcon className="h-5 w-5 text-indigo-400" />
                عن الكورس
              </h2>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {course.description ||
                  `هذا الكورس مصمم ليأخذك من المستوى ${course.level} إلى مستوى متقدم. سنغطي أساسيات ومتقدمات ${sectionLabel}، مع تطبيقات عملية ومشاريع واقعية. الكورس مناسب للمبتدئين والمتوسطين الذين يريدون إتقان ${sectionLabel} بشكل احترافي.`}
              </p>
            </motion.div>

            {/* What You'll Learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border p-6"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <h2
                className="flex items-center gap-2 text-base font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                ماذا ستتعلم
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  `أساسيات ومتقدمات ${sectionLabel}`,
                  "تطبيقات عملية ومشاريع واقعية",
                  "أفضل الممارسات في المجال",
                  "حل مشاكل حقيقية من سوق العمل",
                  "بناء Portfolio قوي",
                  "الاستعداد للمقابلات التقنية",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border p-6"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <h2
                className="flex items-center gap-2 text-base font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                <AcademicCapIcon className="h-5 w-5 text-amber-400" />
                المتطلبات
              </h2>
              <ul className="mt-4 space-y-2">
                {[
                  "معرفة أساسية بالكمبيوتر",
                  "الرغبة في التعلم والتطبيق",
                  "لا يحتاج خبرة سابقة",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ═══ Instructor Section ═══ */}
            {instructor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--card)",
                }}
              >
                <h2
                  className="flex items-center gap-2 text-base font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  <AcademicCapIcon className="h-5 w-5 text-indigo-400" />
                  المدرّس
                </h2>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div
                    className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent), #8b5cf6)",
                      boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    {instructor.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3
                        className="text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {instructor.name}
                      </h3>
                      <div className="flex items-center gap-1 rounded-lg bg-amber-500/15 px-2 py-0.5">
                        <StarIconSolid className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">
                          {instructorRating}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          ({instructor.ratingCount})
                        </span>
                      </div>
                    </div>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {instructor.specialty}
                    </p>
                    <p
                      className="mt-2 text-xs leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {instructor.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ Groups Section ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2
                  className="flex items-center gap-2 text-base font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  <UsersIcon className="h-5 w-5 text-cyan-400" />
                  الجروبات المتاحة
                  <span
                    className="text-sm font-normal"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ({groups.length})
                  </span>
                </h2>
              </div>

              {groups.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {groups.map((group, index) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      index={index}
                      onEnroll={handleEnroll}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl border border-dashed p-12 text-center"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    لا توجد جروبات متاحة حالياً.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ═══ Right: Sticky Sidebar ═══ */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:sticky lg:top-6 lg:self-start"
          >
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              {/* Price Header */}
              <div
                className="relative overflow-hidden p-6"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1))",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-indigo-500/30 blur-2xl"
                />
                <div className="relative">
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    سعر الكورس
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span
                      className="text-3xl font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {course.price.toLocaleString()}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {CURRENCY.symbol}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-6 space-y-3">
                {[
                  { icon: PlayCircleIcon, label: "فيديوهات عالية الجودة" },
                  { icon: DocumentTextIcon, label: "مواد تعليمية شاملة" },
                  { icon: TrophyIcon, label: "شهادة إتمام معتمدة" },
                  { icon: UsersIcon, label: "مجتمع طلابي داعم" },
                  { icon: CheckCircleIcon, label: "دعم فني مباشر" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <feature.icon className="h-4 w-4 flex-shrink-0 text-indigo-400" />
                    <span style={{ color: "var(--text-secondary)" }}>
                      {feature.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div
                className="border-t p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  onClick={() => {
                    const firstAvailable = groups.find(
                      (g) => g.enrolled < g.capacity
                    );
                    if (firstAvailable) handleEnroll(firstAvailable);
                  }}
                  disabled={availableSpots === 0}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                    availableSpots === 0
                      ? "cursor-not-allowed bg-slate-800 text-slate-500"
                      : "text-white hover:brightness-110 active:scale-[0.98]"
                  }`}
                  style={
                    availableSpots > 0
                      ? {
                          background:
                            "linear-gradient(135deg, var(--accent), #8b5cf6)",
                          boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
                        }
                      : {}
                  }
                >
                  <SparklesIcon className="h-4 w-4" />
                  {availableSpots === 0 ? "كل الجروبات مكتملة" : "سجل في الكورس"}
                </button>

                {availableSpots > 0 && (
                  <p
                    className="mt-3 text-center text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    🔥 {availableSpots} مكان متاح فقط
                  </p>
                )}

                <div
                  className="mt-4 flex items-center justify-center gap-4 border-t pt-4 text-[10px]"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>✓ ضمان استرداد</span>
                  <span>✓ دفع آمن</span>
                  <span>✓ وصول مدى الحياة</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

      </div>
    </div>
  );
}