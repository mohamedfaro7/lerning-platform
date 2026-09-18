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
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  SECTIONS,
  CURRENCY,
  getStats,
  getGroupsByInstructor,
} from "../../constants/mockLearningData";
import StarRating from "../../component/common/StarRating";

// ═══════════════════════════════════════════════════════════
//   المكونات الفرعية
// ═══════════════════════════════════════════════════════════

/** كارت إحصائي واحد */
function StatCard({ icon: Icon, label, value, unit = "", color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-white truncate">
            {value}
            {unit && <span className="text-sm font-medium text-slate-400 ml-1">{unit}</span>}
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

/** Info Strip */
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
      transition={{ delay: 0.2 }}
      className="flex items-center justify-center gap-6 rounded-2xl border border-slate-800 bg-slate-950/40 py-3 px-4"
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <item.icon className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-bold text-white">{item.value}</span>
          <span className="text-xs text-slate-400">{item.label}</span>
          {i < items.length - 1 && <span className="text-slate-700 mx-2">•</span>}
        </div>
      ))}
    </motion.div>
  );
}

/** بطاقة مدرّس */
function InstructorCard({ instructor, onSelect }) {
  const groups = getGroupsByInstructor(instructor.id);
  const totalStudents = groups.reduce((sum, g) => sum + g.enrolled, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(instructor)}
      className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl transition-all hover:border-indigo-500/50 hover:bg-slate-900"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xl font-bold text-indigo-400">
          {instructor.avatar}
        </div>

        {/* Info */}
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
            <StarRating rating={instructor.rating} count={instructor.ratingCount} />
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
            <span>{groups.length} جروب</span>
            <span className="text-slate-700">•</span>
            <span>{totalStudents} طالب</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   المكون الرئيسي
// ═══════════════════════════════════════════════════════════
export default function Analytics() {
  const [activeTab, setActiveTab] = useState("general");
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // التابات
  const tabs = [
    { id: "general", label: "نظرة عامة", icon: "📊" },
    { id: "english", label: "English", icon: "🇬🇧" },
    { id: "programming", label: "Programming", icon: "💻" },
  ];

  // ⭐ الإحصائيات (تتحدث تلقائياً حسب التاب)
  const stats = useMemo(() => {
    return getStats(activeTab === "general" ? null : activeTab);
  }, [activeTab]);

  // فلترة المدرسين حسب التاب
  const filteredInstructors = useMemo(() => {
    if (activeTab === "general") return stats.instructors;
    return stats.instructors.filter((i) => i.sectionId === activeTab);
  }, [stats.instructors, activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4" dir="rtl">
      <div className="mx-auto max-w-7xl">

        {/* ═══ Header ═══ */}
        <div className="mb-6">
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
        </div>

        {/* ═══ Tabs ═══ */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 backdrop-blur-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ KPI Cards ═══ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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

            {/* ═══ Info Strip ═══ */}
            <div className="mt-4">
              <InfoStrip
                courses={stats.totalCourses}
                instructors={stats.totalInstructors}
                groups={stats.totalGroups}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ═══ Instructors List ═══ */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              المدرسين{" "}
              <span className="text-sm font-normal text-slate-500">
                ({filteredInstructors.length})
              </span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInstructors.map((instructor) => (
              <InstructorCard
                key={instructor.id}
                instructor={instructor}
                onSelect={setSelectedInstructor}
              />
            ))}
          </div>

          {filteredInstructors.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <p className="text-slate-400">لا يوجد مدرسين في هذا القسم.</p>
            </div>
          )}
        </div>

        {/* ═══ Instructor Detail Placeholder (هيتعمل لاحقاً) ═══ */}
        {selectedInstructor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-lg font-bold text-white">
                صفحة تفاصيل: {selectedInstructor.name}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                (هتتعمل في الخطوة الجاية)
              </p>
              <button
                onClick={() => setSelectedInstructor(null)}
                className="mt-4 rounded-xl bg-indigo-600 px-6 py-2 text-sm font-bold text-white"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}