import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import {
  MOCK_INSTRUCTORS,
  MOCK_GROUPS,
  getGroupsByInstructor,
  getStudentsByGroup,
  getStudentRating,
  getRatingsByInstructor,
  getInstructorStudentsAvg,
  getInstructorAttendanceAvg,
  getInstructorPerformanceAvg,
} from "../../constants/mockLearningData";
import RateStudentModal from "../../component/common/TracksAndJobs/RateStudentModal";
import StarRating from "../../component/common/StarRating";

export default function RateStudents() {
  // ⭐ مبدئياً: المدرّس ثابت للعرض (ممكن نختاره لاحقاً)
  const [selectedInstructorId, setSelectedInstructorId] = useState("inst_004");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("all");
  const [modal, setModal] = useState({ open: false, student: null, group: null, existingRating: null });

  // البيانات
  const instructor = MOCK_INSTRUCTORS.find((i) => i.id === selectedInstructorId);
  const groups = getGroupsByInstructor(selectedInstructorId);

  // تقييمات المدرّس الحالية (للحالة الفورية عند الحفظ)
  const [ratings, setRatings] = useState(() => getRatingsByInstructor(selectedInstructorId));

  // إحصائيات
  const avgRating = getInstructorStudentsAvg(selectedInstructorId);
  const avgAttendance = getInstructorAttendanceAvg(selectedInstructorId);
  const avgPerformance = getInstructorPerformanceAvg(selectedInstructorId);

  // كل الطلاب في كل جروبات المدرّس
  const allStudents = useMemo(() => {
    const result = [];
    groups.forEach((group) => {
      const students = getStudentsByGroup(group.id);
      students.forEach((student) => {
        result.push({ student, group });
      });
    });
    return result;
  }, [groups]);

  // الفلترة
  const filteredStudents = useMemo(() => {
    return allStudents.filter(({ student, group }) => {
      if (searchQuery && !student.name.includes(searchQuery)) return false;
      if (selectedGroupFilter !== "all" && group.id !== selectedGroupFilter) return false;
      return true;
    });
  }, [allStudents, searchQuery, selectedGroupFilter]);

  // 📝 حفظ التقييم
  const handleSaveRating = (ratingData) => {
    // هنا هنحفظ في الـ State (مبدئياً)، وبعدين هنبعت للـ API
    setRatings((prev) => {
      const existingIndex = prev.findIndex(
        (r) => r.studentId === ratingData.studentId && r.groupId === ratingData.groupId
      );

      const newRating = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `sr_new_${Date.now()}`,
        ...ratingData,
        instructorId: selectedInstructorId,
        createdAt: new Date().toISOString().split("T")[0],
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newRating;
        return updated;
      }
      return [...prev, newRating];
    });

    setModal({ open: false, student: null, group: null, existingRating: null });
  };

  // فتح Modal التقييم
  const openRateModal = (student, group) => {
    const existing = ratings.find(
      (r) => r.studentId === student.id && r.groupId === group.id
    );
    setModal({
      open: true,
      student,
      group,
      existingRating: existing || null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4" dir="rtl">
      <div className="mx-auto max-w-6xl">

        {/* ═══ Header ═══ */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            <ClipboardDocumentCheckIcon className="h-4 w-4" />
            لوحة المدرّس
          </div>
          <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
            تقييم <span className="text-indigo-400">الطلاب</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            قيّم أداء طلابك في الجروبات، وساعدهم على التطور.
          </p>
        </div>

        {/* ═══ Instructor Selector (للتجربة) ═══ */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <label className="mb-2 block text-xs font-medium text-slate-400">
            أنت الآن تتصفح كـ (للتجربة فقط):
          </label>
          <select
            value={selectedInstructorId}
            onChange={(e) => {
              setSelectedInstructorId(e.target.value);
              setRatings(getRatingsByInstructor(e.target.value));
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
          >
            {MOCK_INSTRUCTORS.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name} — {inst.specialty}
              </option>
            ))}
          </select>
        </div>

        {/* ═══ Stats ═══ */}
        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
            <p className="text-xs text-slate-400">إجمالي الطلاب</p>
            <p className="mt-1.5 text-2xl font-black text-white">{allStudents.length}</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
            <p className="text-xs text-amber-300">متوسط التقييم</p>
            <p className="mt-1.5 text-2xl font-black text-amber-400">
              {avgRating} <span className="text-sm">⭐</span>
            </p>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
            <p className="text-xs text-cyan-300">متوسط الحضور</p>
            <p className="mt-1.5 text-2xl font-black text-cyan-400">{avgAttendance}%</p>
          </div>
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
            <p className="text-xs text-indigo-300">متوسط الأداء</p>
            <p className="mt-1.5 text-2xl font-black text-indigo-400">
              {avgPerformance} <span className="text-sm">⭐</span>
            </p>
          </div>
        </div>

        {/* ═══ Filters ═══ */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث باسم الطالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pr-10 pl-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">كل الجروبات ({groups.length})</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nameAr} ({g.enrolled} طالب)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ═══ Students List ═══ */}
        <div className="space-y-2">
          {filteredStudents.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <UserGroupIcon className="mx-auto h-12 w-12 text-slate-600" />
              <p className="mt-4 text-slate-400">لا يوجد طلاب مطابقون للبحث</p>
            </div>
          ) : (
            filteredStudents.map(({ student, group }, index) => {
              const existingRating = ratings.find(
                (r) => r.studentId === student.id && r.groupId === group.id
              );

              return (
                <motion.div
                  key={`${student.id}-${group.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl transition hover:border-slate-700"
                >
                  {/* معلومات الطالب */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-300">
                      {student.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {group.nameAr}
                      </p>
                    </div>
                  </div>

                  {/* التقييم الحالي */}
                  {existingRating ? (
                    <div className="flex items-center gap-3">
                      <StarRating rating={existingRating.overallRating} count={null} />
                      <div className="hidden sm:flex items-center gap-2 text-xs">
                        {existingRating.attendance !== null && (
                          <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-cyan-400">
                            {existingRating.attendance}%
                          </span>
                        )}
                        {existingRating.performance && (
                          <span className="rounded-md bg-indigo-500/10 px-2 py-1 text-indigo-400">
                            ⭐ {existingRating.performance}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">لم يتم التقييم بعد</span>
                  )}

                  {/* زر التقييم */}
                  <button
                    onClick={() => openRateModal(student, group)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                      existingRating
                        ? "border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-indigo-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {existingRating ? (
                      <>
                        <PencilSquareIcon className="h-4 w-4" />
                        تعديل
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4" />
                        قيّم
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })
          )}
        </div>

      </div>

      {/* ═══ Rate Student Modal ═══ */}
      <RateStudentModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, student: null, group: null, existingRating: null })}
        onSave={handleSaveRating}
        student={modal.student}
        group={modal.group}
        existingRating={modal.existingRating}
      />
    </div>
  );
}