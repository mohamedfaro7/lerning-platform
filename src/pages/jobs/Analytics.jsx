import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  StarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  CURRENCY,
  getStats,
  getGroupsByInstructor,
} from "../../constants/mockLearningData";
import StarRating from "../../component/common/StarRating";
import InstructorDetail from "../../component/common/TracksAndJobs/InstructorDetail";

// ═══════════════════════════════════════════════════════════
//   Sub-Components
// ═══════════════════════════════════════════════════════════

/** Single KPI Metric Card */
function StatCard({ icon: Icon, label, value, unit = "", color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl transition hover:border-slate-700/80"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-white truncate">
            {value}
            {unit && (
              <span className="text-sm font-medium text-slate-400 ms-1">
                {unit}
              </span>
            )}
          </p>
        </div>
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

/** Summary Info Strip */
function InfoStrip({ courses, instructors, groups }) {
  const items = [
    { icon: BookOpenIcon, value: courses, label: "كورس" },
    { icon: AcademicCapIcon, value: instructors, label: "مدرّس" },
    { icon: UserGroupIcon, value: groups, label: "جروب" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.2 }}
      className="flex items-center justify-center gap-6 rounded-2xl border border-slate-800 bg-slate-950/40 py-3 px-4"
    >
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-2">
          <item.icon className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-bold text-white">{item.value}</span>
          <span className="text-xs text-slate-400">{item.label}</span>
          {i < items.length - 1 && (
            <span className="text-slate-700 mx-2" aria-hidden="true">
              •
            </span>
          )}
        </div>
      ))}
    </motion.div>
  );
}

/** Instructor Card Trigger Component */
function InstructorCard({ instructor, onSelect }) {
  const groups = getGroupsByInstructor(instructor.id);
  const totalStudents = groups.reduce((sum, g) => sum + g.enrolled, 0);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(instructor)}
      className="group w-full text-right cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl transition-all hover:border-indigo-500/50 hover:bg-slate-900 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xl font-bold text-indigo-400 border border-indigo-500/30">
          {instructor.avatar}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">
                {instructor.name}
              </h3>
              <p className="text-xs text-indigo-400 truncate">
                {instructor.specialty}
              </p>
            </div>
            <ArrowLeftIcon className="h-5 w-5 flex-shrink-0 text-slate-600 transition-transform group-hover:-translate-x-1 group-hover:text-indigo-400" />
          </div>

          {/* Rating */}
          <div className="mt-2">
            <StarRating
              rating={instructor.rating}
              count={instructor.ratingCount}
            />
          </div>

          {/* Group Stats */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span>{groups.length} جروب</span>
            <span className="text-slate-700" aria-hidden="true">
              •
            </span>
            <span>{totalStudents} طالب</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════
//   Main Analytics Component
// ═══════════════════════════════════════════════════════════
export default function Analytics() {
  const [activeTab, setActiveTab] = useState("general");
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const tabs = [
    { id: "general", label: "نظرة عامة", icon: "📊" },
    { id: "english", label: "English", icon: "🇬🇧" },
    { id: "programming", label: "Programming", icon: "💻" },
  ];

  // Dynamically compute stats according to selected section
  const stats = useMemo(() => {
    return getStats(activeTab === "general" ? null : activeTab);
  }, [activeTab]);

  // Filter instructors based on section tab selection
  const filteredInstructors = useMemo(() => {
    if (activeTab === "general") return stats.instructors;
    return stats.instructors.filter((i) => i.sectionId === activeTab);
  }, [stats.instructors, activeTab]);

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            <ChartBarIcon className="h-4 w-4" />
            لوحة التحليلات
          </div>
          <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
            إحصائيات <span className="text-indigo-400">المنصة</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            نظرة شاملة على أداء المنصة، المدرسين، والإيرادات.
          </p>
        </header>

        {/* Section Tabs */}
        <nav
          className="mb-6 flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 backdrop-blur-xl"
          aria-label="قسم التحليلات"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all active:scale-[0.98] ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <span aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Key Metrics Dashboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={UsersIcon}
                label="إجمالي الطلاب"
                value={stats.totalStudents}
                color="#3b82f6"
                delay={0}
              />
              <StatCard
                icon={BanknotesIcon}
                label="الإيرادات المحصلة"
                value={stats.collected.toLocaleString()}
                unit={CURRENCY.symbol}
                color="#10b981"
                delay={0.05}
              />
              <StatCard
                icon={ExclamationTriangleIcon}
                label="الديون المتبقية"
                value={stats.pending.toLocaleString()}
                unit={CURRENCY.symbol}
                color="#f59e0b"
                delay={0.1}
              />
              <StatCard
                icon={StarIcon}
                label="متوسط التقييم"
                value={stats.avgRating}
                unit="⭐"
                color="#a855f7"
                delay={0.15}
              />
            </div>

            <InfoStrip
              courses={stats.totalCourses}
              instructors={stats.totalInstructors}
              groups={stats.totalGroups}
            />
          </motion.div>
        </AnimatePresence>

        {/* Instructor Directory */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              المدرسين{" "}
              <span className="text-sm font-normal text-slate-500">
                ({filteredInstructors.length})
              </span>
            </h2>
          </div>

          {filteredInstructors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredInstructors.map((instructor) => (
                <InstructorCard
                  key={instructor.id}
                  instructor={instructor}
                  onSelect={setSelectedInstructor}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
              <p className="text-slate-400">لا يوجد مدرسين في هذا القسم.</p>
            </div>
          )}
        </section>

        {/* Instructor Detail Modal */}
        <InstructorDetail
          instructor={selectedInstructor}
          isOpen={!!selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
        />
      </div>
    </div>
  );
}