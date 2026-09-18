import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BanknotesIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  getGroupsByInstructor,
  getStudentsByGroup,
  getFeedbackByInstructor,
  getStudentById,
  getGroupCollected,
  getInstructorRevenue,
  CURRENCY,
} from "../../../constants/mockLearningData";
import StarRating from "../StarRating";

// ─── Sub-Component: Feedback Card ───
function FeedbackCard({ feedback }) {
  const student = getStudentById(feedback.studentId);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700/60">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-indigo-400 border border-slate-700/50">
            {student?.avatar || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">
              {student?.name || "طالب"}
            </p>
            <p className="text-[10px] text-slate-500">
              {new Date(feedback.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>
        </div>
        <StarRating rating={feedback.rating} showNumber={false} />
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
        "{feedback.comment}"
      </p>
    </div>
  );
}

// ─── Sub-Component: Metric Card ───
function StatCard({ icon: Icon, label, value, subValue, variant = "default" }) {
  const isEmerald = variant === "emerald";

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isEmerald
          ? "border-emerald-500/30 bg-emerald-950/20"
          : "border-slate-800 bg-slate-950/40"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${isEmerald ? "text-emerald-400" : "text-slate-400"}`} />
        <p className={`text-xs ${isEmerald ? "text-emerald-300" : "text-slate-400"}`}>
          {label}
        </p>
      </div>
      <p
        className={`mt-2 text-2xl font-black ${
          isEmerald ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
        {subValue && (
          <span
            className={`text-sm font-normal ml-1 ${
              isEmerald ? "text-emerald-300" : "text-slate-400"
            }`}
          >
            {subValue}
          </span>
        )}
      </p>
    </div>
  );
}

export default function InstructorDetail({ instructor, isOpen, onClose }) {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showAllFeedbackModal, setShowAllFeedbackModal] = useState(false);

  // Close modals on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showAllFeedbackModal) {
          setShowAllFeedbackModal(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showAllFeedbackModal, onClose]);

  if (!instructor || !isOpen) return null;

  const groups = getGroupsByInstructor(instructor.id);
  const feedbacks = getFeedbackByInstructor(instructor.id);
  const totalRevenue = getInstructorRevenue(instructor.id);
  const totalStudents = groups.reduce((sum, g) => sum + g.enrolled, 0);
  const visibleFeedbacks = feedbacks.slice(0, 3);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 backdrop-blur-md sm:p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl custom-scrollbar"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-900/95 p-6 backdrop-blur-xl">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-2xl font-bold text-indigo-400">
                    {instructor.avatar}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-white truncate">
                      {instructor.name}
                    </h2>
                    <p className="mt-0.5 text-sm font-medium text-indigo-400">
                      {instructor.specialty}
                    </p>
                    <div className="mt-2">
                      <StarRating
                        rating={instructor.rating}
                        count={instructor.ratingCount}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="إغلاق النافذة"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Instructor Information */}
                <section>
                  <h3 className="mb-3 text-sm font-bold text-slate-300">
                    📋 معلومات المدرّس
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <EnvelopeIcon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm text-slate-300 truncate">
                        {instructor.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <PhoneIcon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm text-slate-300">
                        {instructor.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/40 p-3 sm:col-span-2">
                      <CalendarIcon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm text-slate-300">
                        انضم في:{" "}
                        {new Date(instructor.joinedAt).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                  </div>

                  {instructor.bio && (
                    <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                      <p className="text-sm leading-relaxed text-slate-400">
                        {instructor.bio}
                      </p>
                    </div>
                  )}
                </section>

                {/* Financial Stats */}
                <section>
                  <h3 className="mb-3 text-sm font-bold text-slate-300">
                    📊 الإحصائيات المالية
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <StatCard
                      icon={BanknotesIcon}
                      label="إجمالي الإيرادات"
                      value={totalRevenue.toLocaleString()}
                      subValue={CURRENCY.symbol}
                      variant="emerald"
                    />
                    <StatCard
                      icon={UserGroupIcon}
                      label="الجروبات"
                      value={groups.length}
                    />
                    <StatCard
                      icon={UsersIcon}
                      label="إجمالي الطلاب"
                      value={totalStudents}
                    />
                  </div>
                </section>

                {/* Student Feedback */}
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-indigo-400" />
                      آراء الطلاب ({feedbacks.length})
                    </h3>
                  </div>

                  {feedbacks.length === 0 ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center">
                      <p className="text-sm text-slate-500">لا توجد تقييمات بعد.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {visibleFeedbacks.map((fb) => (
                          <FeedbackCard key={fb.id} feedback={fb} />
                        ))}
                      </div>

                      {feedbacks.length > 3 && (
                        <button
                          onClick={() => setShowAllFeedbackModal(true)}
                          className="mt-3 w-full rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-indigo-400 active:scale-[0.99]"
                        >
                          عرض كل التقييمات ({feedbacks.length})
                        </button>
                      )}
                    </>
                  )}
                </section>

                {/* Groups Accordion */}
                <section>
                  <h3 className="mb-3 text-sm font-bold text-slate-300">
                    👥 الجروبات ({groups.length})
                  </h3>
                  <div className="space-y-3">
                    {groups.map((group) => {
                      const occupancy = Math.round(
                        (group.enrolled / group.capacity) * 100
                      );
                      const isExpanded = expandedGroup === group.id;
                      const students = getStudentsByGroup(group.id);
                      const collected = getGroupCollected(group.id);

                      return (
                        <div
                          key={group.id}
                          className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 transition hover:border-slate-700"
                        >
                          <button
                            onClick={() =>
                              setExpandedGroup(isExpanded ? null : group.id)
                            }
                            className="flex w-full items-center justify-between gap-3 p-4 text-right transition hover:bg-slate-900/60"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-white truncate">
                                  {group.nameAr}
                                </p>
                                <ChevronDownIcon
                                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {group.schedule}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                <span>
                                  {group.enrolled}/{group.capacity} طالب
                                </span>
                                <span className="text-slate-700">•</span>
                                <span>
                                  {group.price.toLocaleString()} {CURRENCY.symbol}
                                </span>
                                <span className="text-slate-700">•</span>
                                <span className="text-emerald-400 font-medium">
                                  محصل: {collected.toLocaleString()}
                                </span>
                              </div>
                              {/* Progress Bar */}
                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    occupancy >= 90
                                      ? "bg-rose-500"
                                      : occupancy >= 60
                                      ? "bg-amber-500"
                                      : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${occupancy}%` }}
                                />
                              </div>
                            </div>
                            <span
                              className={`flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${
                                occupancy >= 90
                                  ? "bg-rose-500/20 text-rose-400"
                                  : occupancy >= 60
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-emerald-500/20 text-emerald-400"
                              }`}
                            >
                              {occupancy}%
                            </span>
                          </button>

                          {/* Accordion Content */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden border-t border-slate-800"
                              >
                                <div className="p-4 bg-slate-900/40">
                                  <p className="mb-2.5 text-xs font-bold text-slate-400">
                                    الطلاب ({students.length})
                                  </p>
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {students.map((student) => (
                                      <div
                                        key={student.id}
                                        className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                                            {student.avatar}
                                          </div>
                                          <span className="text-xs text-slate-300 truncate">
                                            {student.name}
                                          </span>
                                        </div>
                                        {student.paymentStatus === "paid" ? (
                                          <CheckCircleIcon className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                                        ) : student.paymentStatus === "partial" ? (
                                          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 text-amber-400" />
                                        ) : (
                                          <XMarkIcon className="h-4 w-4 flex-shrink-0 text-rose-400" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Feedbacks Modal */}
      <AnimatePresence>
        {showAllFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllFeedbackModal(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-2 backdrop-blur-md sm:p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/95 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      كل التقييمات
                    </h3>
                    <p className="text-xs text-slate-400">
                      {instructor.name} • {feedbacks.length} تقييم
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAllFeedbackModal(false)}
                  aria-label="إغلاق النافذة"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-5 space-y-3 flex-1 custom-scrollbar">
                {feedbacks.map((fb) => (
                  <FeedbackCard key={fb.id} feedback={fb} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}