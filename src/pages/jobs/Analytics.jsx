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
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  CURRENCY,
  getStats,
  getGroupsByInstructor,
} from "../../constants/mockLearningData";
import StarRating from "../../component/common/StarRating";
import InstructorDetail from "../../component/common/TracksAndJobs/InstructorDetail";
import StudentsDonutChart from "../../component/common/charts/StudentsDonutChart";
import RevenueBarChart from "../../component/common/charts/RevenueBarChart";
import GrowthLineChart from "../../component/common/charts/GrowthLineChart";
import {
  getChartData,
  MOCK_GROWTH_DATA,
} from "../../constants/mockLearningData";
// ═══════════════════════════════════════════════════════════
//   Sub-Components
// ═══════════════════════════════════════════════════════════

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative min-w-[200px] max-w-md flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 px-4 pl-10 text-sm text-white placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
    </div>
  );
}

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
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xl font-bold text-indigo-400 border border-indigo-500/30">
          {instructor.avatar}
        </div>

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

          <div className="mt-2">
            <StarRating
              rating={instructor.rating}
              count={instructor.ratingCount}
            />
          </div>

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
  // بعد stats
const chartData = useMemo(() => getChartData(), []);

  // Search & Filter States
  const [instructorQuery, setInstructorQuery] = useState("");
  const [groupQuery, setGroupQuery] = useState("");
  // Options: 'all' | 'active' | 'not_full' | 'not_started'
  const [groupFilter, setGroupFilter] = useState("all");
  const [studentQuery, setStudentQuery] = useState("");

  const tabs = [
    { id: "general", label: "نظرة عامة", icon: "📊" },
    { id: "english", label: "English", icon: "🇬🇧" },
    { id: "programming", label: "Programming", icon: "💻" },
  ];

  const stats = useMemo(() => {
    return getStats(activeTab === "general" ? null : activeTab);
  }, [activeTab]);

  // Filtered Instructors
  const filteredInstructors = useMemo(() => {
    let list =
      activeTab === "general"
        ? stats.instructors
        : stats.instructors.filter((i) => i.sectionId === activeTab);

    if (instructorQuery.trim()) {
      const q = instructorQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.specialty.toLowerCase().includes(q)
      );
    }
    return list;
  }, [stats.instructors, activeTab, instructorQuery]);

  // Filtered Groups
  const filteredGroups = useMemo(() => {
    let list = stats.groups || [];

    if (groupQuery.trim()) {
      const q = groupQuery.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.courseName?.toLowerCase().includes(q)
      );
    }

    if (groupFilter === "active") {
      list = list.filter(
        (g) => g.status === "active" || g.isStarted === true
      );
    } else if (groupFilter === "not_full") {
      list = list.filter((g) => g.enrolled < (g.maxCapacity || 20));
    } else if (groupFilter === "not_started") {
      list = list.filter(
        (g) => g.status === "upcoming" || g.isStarted === false
      );
    }

    return list;
  }, [stats.groups, groupQuery, groupFilter]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    let list = stats.students || [];

    if (studentQuery.trim()) {
      const q = studentQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [stats.students, studentQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            <ChartBarIcon className="h-4 w-4" />
            لوحة التحليلات
          </div>
          <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
            إحصائيات <span className="text-indigo-400">المنصة</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            نظرة شاملة على أداء المنصة، المدرسين، والجروبات والطلاب.
          </p>
        </header>

        {/* Section Tabs */}
        <nav className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 backdrop-blur-xl">
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
            {/* ═══ Charts Section (تظهر فقط في التاب العام) ═══ */}
{activeTab === "general" && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25 }}
    className="grid gap-4 lg:grid-cols-2"
  >
    <StudentsDonutChart data={chartData.studentsDistribution} />
    <RevenueBarChart
      data={chartData.revenueBySection}
      currencySymbol={CURRENCY.symbol}
    />
    <div className="lg:col-span-2">
      <GrowthLineChart data={MOCK_GROWTH_DATA} />
    </div>
  </motion.div>
)}
          </motion.div>
        </AnimatePresence>

        {/* Instructors Directory */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AcademicCapIcon className="h-5 w-5 text-indigo-400" />
              المدرسين
              <span className="text-sm font-normal text-slate-500">
                ({filteredInstructors.length})
              </span>
            </h2>

            <SearchInput
              value={instructorQuery}
              onChange={setInstructorQuery}
              placeholder="ابحث باسم المدرس أو التخصص..."
            />
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
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
              <p className="text-slate-400">لا يوجد مدرسين يطابقون البحث.</p>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* GROUPS MANAGEMENT SECTION WITH ACTIVE FILTER */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5 text-emerald-400" />
                الجروبات المتاحة
                <span className="text-sm font-normal text-slate-500">
                  ({filteredGroups.length})
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                متابعة سعة الجروبات المتاحة والنشطة
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Tabs with "النشطة" (Active) */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
                {[
                  { id: "all", label: "الكل" },
                  { id: "active", label: "النشطة" },
                  { id: "not_full", label: "لم تكتمل" },
                  { id: "not_started", label: "لم تبدأ" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setGroupFilter(f.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      groupFilter === f.id
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <SearchInput
                value={groupQuery}
                onChange={setGroupQuery}
                placeholder="ابحث باسم الجروب..."
              />
            </div>
          </div>

          {/* Groups Grid Display */}
          {filteredGroups.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGroups.map((group) => {
                const maxCap = group.maxCapacity || 20;
                const isFull = group.enrolled >= maxCap;
                const isActive = group.status === "active" || group.isStarted;

                return (
                  <div
                    key={group.id}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 transition hover:border-slate-700"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-white text-sm truncate">
                        {group.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        {isActive && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            نشط
                          </span>
                        )}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isFull
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {isFull ? "مكتمل" : "متاح"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {group.instructorName || "مدرس الجروب"}
                    </p>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>
                          الأعضاء: {group.enrolled}/{maxCap}
                        </span>
                        <span>
                          {Math.round((group.enrolled / maxCap) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-300"
                          style={{
                            width: `${(group.enrolled / maxCap) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-sm">
              لا توجد جروبات مطابقة للفلتر المحدد.
            </div>
          )}
        </section>

        {/* Students Search & Directory */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-blue-400" />
                سجل الطلاب والاشتراكات
                <span className="text-sm font-normal text-slate-500">
                  ({filteredStudents.length})
                </span>
              </h2>
            </div>

            <SearchInput
              value={studentQuery}
              onChange={setStudentQuery}
              placeholder="ابحث باسم الطالب أو البريد..."
            />
          </div>

          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">الطالب</th>
                    <th className="p-3">الجروبات والمسارات</th>
                    <th className="p-3">حالة الدفع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-semibold text-white">
                        {student.name}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {student.groups?.map((g, idx) => (
                            <span
                              key={idx}
                              className="bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-[11px] px-2 py-0.5 rounded"
                            >
                              {g}
                            </span>
                          )) || "غير مسجل"}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-medium ${
                            student.hasPendingDebt
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {student.hasPendingDebt
                            ? "عليها متبقي"
                            : "مكتمل السداد"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-sm">
              لا يوجد طلاب مطابقين للبحث.
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