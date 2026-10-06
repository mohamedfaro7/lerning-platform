import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpenIcon,
  ClockIcon,
  AcademicCapIcon,
  UsersIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  TrophyIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import {
  CURRENCY,
  SECTIONS,
  getGroupsByCourse,
} from "../../constants/mockLearningData";
import StepIndicator from "../../component/common/enrollment/StepIndicator";
import { useEnrollmentFlow } from "../../component/common/hooks/useEnrollmentFlow";

// ═══════════════════════════════════════════════════════════
//   Instructor Preview (نظرة سريعة — بدون اختيار)
// ═══════════════════════════════════════════════════════════
function InstructorPreview({ instructor }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border p-3"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "color-mix(in srgb, var(--bg) 50%, transparent)",
      }}
    >
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{
          backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
          color: "var(--accent)",
        }}
      >
        {instructor.avatar}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {instructor.name}
        </p>
        <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
          {instructor.specialty}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <StarIconSolid className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-xs font-bold text-amber-400">
          {instructor.rating}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Main Component
// ═══════════════════════════════════════════════════════════
export default function CourseDetail() {
  // ✅ كل حاجة من الـ hook
  const {
    course,
    courseId,
    availableInstructors,
    goToInstructors,
  } = useEnrollmentFlow();

  // الإحصائيات (مشتقة من الكورس)
  const stats = useMemo(() => {
    if (!courseId) return { totalEnrolled: 0, availableSpots: 0, totalGroups: 0 };
    const groups = getGroupsByCourse(courseId);
    const totalEnrolled = groups.reduce((s, g) => s + g.enrolled, 0);
    const totalCapacity = groups.reduce((s, g) => s + g.capacity, 0);
    return {
      totalEnrolled,
      availableSpots: Math.max(0, totalCapacity - totalEnrolled),
      totalGroups: groups.length,
    };
  }, [courseId]);

  // ✅ Guard واحد بس
  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-20" dir="rtl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10">
            <BookOpenIcon className="h-10 w-10 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            الكورس غير موجود
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            الرابط قد يكون غير صحيح أو تم حذف الكورس.
          </p>
          <Link
            to="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <ArrowRightIcon className="h-4 w-4" />
            العودة للكورسات
          </Link>
        </div>
      </div>
    );
  }

  const { totalEnrolled, availableSpots, totalGroups } = stats;
  const section = SECTIONS.find((s) => s.id === course.sectionId);
  const sectionLabel = section?.nameAr || course.sectionId;
  const isAvailable = availableSpots > 0 && availableInstructors.length > 0;

  return (
    <div className="min-h-screen px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-6xl">

        <StepIndicator currentStep={1} />

        {/* ═══ Breadcrumb ═══ */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center gap-2 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <Link to="/" className="transition hover:opacity-80">الرئيسية</Link>
          <span>/</span>
          <Link to="/courses" className="transition hover:opacity-80">الكورسات</Link>
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
              "linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--accent) 8%, transparent) 100%)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 h-64 w-64 rounded-full blur-3xl"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(168, 85, 247, 0.2)" }}
          />

          <div className="relative">
            {/* Badges */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className="rounded-lg px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
                  color: "var(--accent)",
                }}
              >
                {sectionLabel}
              </span>
              <span className="rounded-lg bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                {course.level}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                <TrophyIcon className="h-3.5 w-3.5" />
                شهادة معتمدة
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display text-2xl font-black leading-tight sm:text-3xl lg:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              {course.titleAr || course.title}
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              {course.title}
            </p>

            {/* Meta Stats */}
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15">
                  <UsersIcon className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {totalEnrolled} طالب
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
                  <ClockIcon className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {course.duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15">
                  <UserGroupIcon className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {availableInstructors.length} مدرّس
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                  <AcademicCapIcon className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {availableSpots} مكان متاح
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Main Grid ═══ */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ═══ Left Content ═══ */}
          <div className="space-y-6">

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border p-6"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: "var(--text-primary)" }}>
                <DocumentTextIcon className="h-5 w-5 text-indigo-400" />
                عن الكورس
              </h2>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {course.description ||
                  `هذا الكورس مصمم ليأخذك من المستوى ${course.level} إلى مستوى متقدم. سنغطي أساسيات ومتقدمات ${sectionLabel}، مع تطبيقات عملية ومشاريع واقعية.`}
              </p>
            </motion.div>

            {/* What you'll learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border p-6"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: "var(--text-primary)" }}>
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
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Instructors Preview */}
            {availableInstructors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border p-6"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    <AcademicCapIcon className="h-5 w-5 text-indigo-400" />
                    المدرّسون المتاحون
                  </h2>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {availableInstructors.length} مدرّس
                  </span>
                </div>

                <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  في الخطوة الجاية هتختار المدرّس المناسب ليك.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {availableInstructors.slice(0, 4).map((inst) => (
                    <InstructorPreview key={inst.id} instructor={inst} />
                  ))}
                </div>

                {availableInstructors.length > 4 && (
                  <p className="mt-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    + {availableInstructors.length - 4} مدرّس آخر
                  </p>
                )}
              </motion.div>
            )}

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border p-6"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: "var(--text-primary)" }}>
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

          </div>

          {/* ═══ Sidebar ═══ */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:sticky lg:top-6 lg:self-start"
          >
            <div
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              {/* Price Header */}
              <div
                className="relative overflow-hidden p-6"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--accent) 15%, transparent), rgba(168, 85, 247, 0.1))",
                }}
              >
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  يبدأ من
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
                    {course.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                    {CURRENCY.symbol}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 p-6">
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
              <div className="border-t p-6" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={goToInstructors}
                  disabled={!isAvailable}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    backgroundColor: "var(--accent)",
                    boxShadow: isAvailable
                      ? "0 4px 16px color-mix(in srgb, var(--accent) 30%, transparent)"
                      : "none",
                  }}
                >
                  <SparklesIcon className="h-4 w-4" />
                  {!isAvailable ? "غير متاح حالياً" : "احجز الآن"}
                </button>

                {isAvailable && (
                  <p className="mt-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    🔥 {availableSpots} مكان متاح في {totalGroups} جروب
                  </p>
                )}

                <div
                  className="mt-4 flex items-center justify-center gap-4 border-t pt-4 text-[10px]"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
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