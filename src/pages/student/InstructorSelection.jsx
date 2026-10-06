import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightIcon,
  AcademicCapIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import StepIndicator from "../../component/common/enrollment/StepIndicator";
import StarRating from "../../component/common/StarRating";
import { useCourseInstructors } from "../../component/common/hooks/useCourseInstructors";

// ═══════════════════════════════════════════════════════════
//   Instructor Card
// ═══════════════════════════════════════════════════════════
function InstructorCard({
  instructor,
  isSelected,
  isDisabled,
  onSelect,
  onWatchVideo,
}) {
  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      onClick={() => !isDisabled && onSelect(instructor)}
      whileHover={!isDisabled ? { y: -4 } : undefined}
      className="group relative w-full overflow-hidden rounded-2xl border p-5 text-right backdrop-blur-xl transition-all disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        borderColor: isSelected ? "var(--accent)" : "var(--border)",
        backgroundColor: isSelected
          ? "color-mix(in srgb, var(--accent) 8%, var(--card))"
          : "var(--card)",
        boxShadow: isSelected
          ? "0 8px 24px color-mix(in srgb, var(--accent) 25%, transparent)"
          : "none",
      }}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 left-4 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-lg"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <CheckCircleIcon className="h-4 w-4" />
        </motion.div>
      )}

      {isDisabled && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-1 text-[10px] font-bold text-amber-400">
          <ExclamationTriangleIcon className="h-3 w-3" />
          مكتمل
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold"
            style={{
              backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
              color: "var(--accent)",
              border: "2px solid color-mix(in srgb, var(--accent) 40%, transparent)",
            }}
          >
            {instructor.avatar}
          </div>
          <div
            className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 bg-emerald-500"
            style={{ borderColor: "var(--card)" }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-base font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {instructor.name}
          </h3>
          <p
            className="truncate text-xs"
            style={{ color: "var(--accent)" }}
          >
            {instructor.specialty}
          </p>
          <div className="mt-1.5">
            <StarRating
              rating={instructor.rating}
              count={instructor.ratingCount}
            />
          </div>
        </div>
      </div>

      <p
        className="mt-3 line-clamp-2 text-xs leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {instructor.bio}
      </p>

      {/* Teaching Skills */}
      <div className="mt-3">
        <p
          className="mb-1.5 text-[10px] font-bold"
          style={{ color: "var(--text-muted)" }}
        >
          المهارات المُدرّسة:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {instructor.teachingSkills?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {skill}
            </span>
          ))}
          {instructor.teachingSkills?.length > 4 && (
            <span
              className="self-center text-[10px] font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              +{instructor.teachingSkills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Meta Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: "color-mix(in srgb, var(--bg) 60%, transparent)" }}
        >
          <div className="flex items-center gap-1.5">
            <UserGroupIcon
              className="h-3 w-3"
              style={{ color: "var(--text-muted)" }}
            />
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              الطلاب
            </span>
          </div>
          <p className="mt-0.5 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {instructor.totalStudents}
          </p>
        </div>
        <div
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: "color-mix(in srgb, var(--bg) 60%, transparent)" }}
        >
          <div className="flex items-center gap-1.5">
            <AcademicCapIcon
              className="h-3 w-3"
              style={{ color: "var(--text-muted)" }}
            />
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              أماكن متاحة
            </span>
          </div>
          <p
            className="mt-0.5 text-sm font-bold"
            style={{ color: instructor.availableSpots > 0 ? "#10b981" : "var(--text-muted)" }}
          >
            {instructor.availableSpots > 0 ? instructor.availableSpots : "—"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWatchVideo(instructor);
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-bold transition"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            backgroundColor: "transparent",
          }}
        >
          <PlayCircleIcon className="h-4 w-4" />
          شاهد الفيديو
        </button>
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════
//   Video Modal
// ═══════════════════════════════════════════════════════════
function VideoModal({ instructor, onClose }) {
  // ⭐ Escape key + body scroll lock
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!instructor) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label={`فيديو تعريف المدرّس ${instructor.name}`}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-2xl border shadow-2xl"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <div
          className="flex items-center justify-between border-b p-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
                color: "var(--accent)",
              }}
            >
              {instructor.avatar}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                {instructor.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                فيديو تعريفي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            aria-label="إغلاق"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="aspect-video w-full" style={{ backgroundColor: "#000" }}>
          {instructor.videoUrl ? (
            <iframe
              src={instructor.videoUrl}
              title={`فيديو ${instructor.name}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <PlayCircleIcon
                  className="mx-auto h-16 w-16"
                  style={{ color: "var(--text-muted)" }}
                />
                <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                  الفيديو غير متاح حالياً
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Main Component
// ═══════════════════════════════════════════════════════════
export default function InstructorSelection() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  // ⭐ الـ selection من الـ URL (يعيش بعد refresh)
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedInstructorId = searchParams.get("instructor");
  const [videoInstructor, setVideoInstructor] = useState(null);

  const { course, instructors } = useCourseInstructors(courseId);

  // لو الكورس غير موجود
  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-20" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            الكورس غير موجود
          </h1>
          <button
            onClick={() => navigate("/courses")}
            className="mt-6 rounded-xl px-6 py-2.5 text-sm font-bold text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            العودة للكورسات
          </button>
        </div>
      </div>
    );
  }

  // ⭐ لو مفيش مدرّسين أصلاً (vs كلهم ممتلئين)
  const hasAnyAvailable = instructors.some((i) => i.hasAvailableSpots);

  const handleSelect = (inst) => {
    setSearchParams({ instructor: inst.id }, { replace: true });
  };

  const handleContinue = () => {
    if (!selectedInstructorId) return;
    navigate(
      `/courses/${courseId}/instructors/${selectedInstructorId}/groups`
    );
  };

  const selectedInstructor = instructors.find(
    (i) => i.id === selectedInstructorId
  );

  return (
    <div className="min-h-screen px-4 py-8 pb-32" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <StepIndicator currentStep={2} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowRightIcon className="h-4 w-4" />
            العودة لتفاصيل الكورس
          </button>

          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
              color: "var(--accent)",
            }}
          >
            <AcademicCapIcon className="h-4 w-4" />
            {course.titleAr || course.title}
          </div>

          <h1
            className="mt-4 text-2xl font-black sm:text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            اختار{" "}
            <span style={{ color: "var(--accent)" }}>المدرّس</span> المناسب
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            شوف فيديو المدرّس، اقرأ مهاراته، واختار الأنسب ليك.
          </p>
        </motion.div>

        {/* ⭐ Empty State — No instructors at all */}
        {instructors.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-12 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <AcademicCapIcon
              className="mx-auto h-12 w-12"
              style={{ color: "var(--text-muted)" }}
            />
            <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              لا يوجد مدرّسون متاحون لهذا الكورس حالياً.
            </p>
          </div>
        ) : (
          <>
            {/* ⭐ Warning — All instructors full */}
            {!hasAnyAvailable && (
              <div
                className="mb-6 flex items-start gap-3 rounded-xl border p-4"
                style={{
                  borderColor: "rgba(245, 158, 11, 0.3)",
                  backgroundColor: "rgba(245, 158, 11, 0.08)",
                }}
              >
                <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-amber-400" />
                <p className="text-sm text-amber-300">
                  كل الجروبات الحالية مكتملة. تقدر تشوف تفاصيل المدرّسين،
                  ونتواصل معاك لما يتفتح جروب جديد.
                </p>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {instructors.map((instructor, index) => (
                <motion.div
                  key={instructor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <InstructorCard
                    instructor={instructor}
                    isSelected={selectedInstructorId === instructor.id}
                    isDisabled={!instructor.hasAvailableSpots}
                    onSelect={handleSelect}
                    onWatchVideo={setVideoInstructor}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "color-mix(in srgb, var(--bg) 95%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            {selectedInstructor ? (
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  {selectedInstructor.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    اخترت
                  </p>
                  <p
                    className="truncate text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedInstructor.name}
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                اختار مدرّساً للاستمرار
              </div>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedInstructorId}
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: "var(--accent)" }}
          >
            التالي
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoInstructor && (
          <VideoModal
            instructor={videoInstructor}
            onClose={() => setVideoInstructor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}