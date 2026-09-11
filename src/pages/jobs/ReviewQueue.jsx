import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  DocumentTextIcon,
  SparklesIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  XCircleIcon,
  CheckCircleIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  FunnelIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { MOCK_APPLICANTS, STATUS_OPTIONS } from "../../constants/mockApplicants";

// مراحل التقييم الست
const STEPS = [
  { id: 1, title: "استلام الطلب", icon: DocumentTextIcon },
  { id: 2, title: "تحليل الذكاء الاصطناعي", icon: SparklesIcon },
  { id: 3, title: "التقييم التقني", icon: SparklesIcon },
  { id: 4, title: "المقابلة الشخصية", icon: CalendarIcon },
  { id: 5, title: "التقييم النهائي", icon: ChatBubbleLeftRightIcon },
  { id: 6, title: "الموافقة والقرار", icon: ShieldCheckIcon },
];

export default function ReviewQueue() {
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // 📊 حساب الأحصائيات السريعة
  const stats = useMemo(() => {
    return {
      total: applicants.length,
      inProgress: applicants.filter((a) => a.status === "in-progress").length,
      accepted: applicants.filter((a) => a.status === "accepted").length,
      rejected: applicants.filter((a) => a.status === "rejected").length,
    };
  }, [applicants]);

  // 🔍 الفلترة والبحث
  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = app.applicant.name.toLowerCase().includes(query);
        const matchesJob = app.jobTitle.toLowerCase().includes(query);
        if (!matchesName && !matchesJob) return false;
      }
      if (filterStatus !== "all" && app.status !== filterStatus) return false;
      return true;
    });
  }, [applicants, searchQuery, filterStatus]);

  // ✅ القبول والانتقال للمرحلة التالية
  const handleApprove = () => {
    if (!selectedApplicant) return;
    const app = selectedApplicant;
    const nextStep = app.currentStep + 1;

    setApplicants((prev) =>
      prev.map((a) => {
        if (a.id !== app.id) return a;
        const updatedSteps = a.steps.map((s, i) => ({
          ...s,
          status: i < nextStep ? "completed" : i === nextStep ? "active" : "pending",
        }));
        return {
          ...a,
          status: nextStep >= 5 ? "accepted" : "in-progress",
          currentStep: nextStep,
          steps: updatedSteps,
        };
      })
    );
    setSelectedApplicant(null);
  };

  // ❌ الرفض مع تسجيل السبب
  const handleReject = () => {
    if (!selectedApplicant || !rejectReason.trim()) return;
    const app = selectedApplicant;

    setApplicants((prev) =>
      prev.map((a) => {
        if (a.id !== app.id) return a;
        const updatedSteps = a.steps.map((s, i) => ({
          ...s,
          status: i < a.currentStep ? "completed" : i === a.currentStep ? "rejected" : "pending",
        }));
        return {
          ...a,
          status: "rejected",
          steps: updatedSteps,
          rejectionReason: rejectReason,
        };
      })
    );
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedApplicant(null);
  };

  const getStatusBadge = (status) => {
    if (status === "accepted")
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
          <CheckCircleIcon className="h-3.5 w-3.5" /> مقبول
        </span>
      );
    if (status === "rejected")
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-400 border border-rose-500/20">
          <XCircleIcon className="h-3.5 w-3.5" /> مرفوض
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
        <ClockIcon className="h-3.5 w-3.5" /> قيد المراجعة
      </span>
    );
  };

  // ═══ تفاصيل المرشح (Detailed View) ═══
  if (selectedApplicant) {
    const app = selectedApplicant;
    const progressPercent = Math.round(((app.currentStep + 1) / STEPS.length) * 100);

    return (
      <div className="p-4 sm:p-6 text-slate-100 dir-rtl">
        <button
          onClick={() => setSelectedApplicant(null)}
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-indigo-400"
        >
          <ArrowRightIcon className="h-4 w-4" />
          العودة إلى مركز التقييم
        </button>

        {/* كارت المرشح الرئيسي */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-xl shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-2xl font-bold text-indigo-400 border border-indigo-500/30">
                {app.applicant.avatar}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{app.applicant.name}</h2>
                <p className="text-xs text-slate-400">{app.applicant.email}</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>📞 {app.applicant.phone}</span>
                  <span>🆔 {app.applicant.idNumber}</span>
                </div>
              </div>
            </div>
            <div className="sm:text-left border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">المسمى الوظيفي Target Role</p>
              <p className="text-sm font-bold text-indigo-400">{app.jobTitle}</p>
              <div className="mt-2">{getStatusBadge(app.status)}</div>
            </div>
          </div>

          {/* شريط التقدم */}
          <div className="mt-5 border-t border-slate-800/80 pt-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">تقدم التقييم العام</span>
              <span className="font-bold text-indigo-400">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* مسار المراحل */}
        <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-xl shadow-xl">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
            <ClipboardDocumentListIcon className="h-4 w-4 text-indigo-400" />
            سير مراحل الاعتماد والتأهيل
          </h3>
          <div className="space-y-2.5">
            {STEPS.map((step, i) => {
              const stepData = app.steps[i];
              const isCompleted = stepData?.status === "completed";
              const isActive = stepData?.status === "active";
              const isRejected = stepData?.status === "rejected";

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    isRejected
                      ? "border-rose-500/30 bg-rose-950/20"
                      : isActive
                      ? "border-indigo-500/40 bg-indigo-950/30 shadow-md shadow-indigo-950/50"
                      : isCompleted
                      ? "border-emerald-500/20 bg-emerald-950/10"
                      : "border-slate-800/60 bg-slate-950/40 opacity-60"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      isRejected
                        ? "bg-rose-500 text-white"
                        : isActive
                        ? "bg-indigo-600 text-white ring-2 ring-indigo-400/40"
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />
                    ) : isRejected ? (
                      <XMarkIcon className="h-3.5 w-3.5 stroke-[3]" />
                    ) : isActive ? (
                      <ClockIcon className="h-3.5 w-3.5 animate-pulse" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-bold ${
                        isRejected
                          ? "text-rose-400"
                          : isActive
                          ? "text-indigo-300"
                          : isCompleted
                          ? "text-emerald-400"
                          : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    {isRejected && app.rejectionReason && (
                      <p className="mt-0.5 text-[11px] text-rose-300/90 truncate">
                        سبب الرفض: {app.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* المرفقات والوثائق */}
        <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-xl shadow-xl">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
            <DocumentTextIcon className="h-4 w-4 text-indigo-400" />
            الملفات والوثائق الرسمية
          </h3>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              { key: "cv", label: "السيرة الذاتية (CV)", icon: "📄" },
              { key: "photo", label: "الصورة الشخصية", icon: "🖼️" },
              { key: "idFront", label: "الهوية (الوجه الأمامي)", icon: "🪪" },
              { key: "idBack", label: "الهوية (الوجه الخلفي)", icon: "🪪" },
            ].map((doc) => (
              <div
                key={doc.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">{doc.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-200 truncate">{doc.label}</p>
                    <p className="text-[9px] text-slate-500 truncate">
                      {app.documents?.[doc.key]?.name || "مرفق معتمد"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors">
                    <DocumentArrowDownIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أزرار اتخاذ القرار */}
        {app.status === "in-progress" && (
          <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-xl shadow-xl">
            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-emerald-600/20"
            >
              <CheckCircleIcon className="h-4 w-4" />
              تأكيد النقل للمرحلة التالية
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 py-2.5 text-xs font-bold text-rose-400 transition-all"
            >
              <XCircleIcon className="h-4 w-4" />
              رفض الطلب
            </button>
          </div>
        )}

        {/* مودال الرفض */}
        <AnimatePresence>
          {showRejectModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
              onClick={() => setShowRejectModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="mb-2 text-sm font-bold text-white">تأكيد سبب رفض المرشح</h3>
                <p className="text-xs text-slate-400 mb-4">
                  سيتم تسجيل هذه الملاحظة في السجل الخاص بالمرشح وإشعاره بها.
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="اكتب أسباب وعدم استيفاء الشروط هنا..."
                  rows="3"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none"
                />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className="flex-1 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
                  >
                    تأكيد وإغلاق الطلب
                  </button>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ═══ القائمة الرئيسية (Overview Dashboard) ═══
  return (
    <div className="p-4 sm:p-6 text-slate-100 dir-rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>مركز تقييم المرشحين</span>
            <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
              Live
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            متابعة دقيقة لمراحل اعتماد طلبات التوظيف والترشح
          </p>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-xl">
          <p className="text-[10px] text-slate-400 font-medium">إجمالي الطلبات</p>
          <p className="text-lg font-black text-white mt-0.5">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 backdrop-blur-xl">
          <p className="text-[10px] text-amber-400/80 font-medium">قيد التدقيق</p>
          <p className="text-lg font-black text-amber-400 mt-0.5">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 backdrop-blur-xl">
          <p className="text-[10px] text-emerald-400/80 font-medium">تم القبول</p>
          <p className="text-lg font-black text-emerald-400 mt-0.5">{stats.accepted}</p>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 backdrop-blur-xl">
          <p className="text-[10px] text-rose-400/80 font-medium">مستبعدين</p>
          <p className="text-lg font-black text-rose-400 mt-0.5">{stats.rejected}</p>
        </div>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur-xl space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="البحث باسم المرشح أو المسمى الوظيفي..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pr-9 pl-3 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <FunnelIcon className="h-3.5 w-3.5 text-slate-500 ml-1" />
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterStatus(opt.id)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                filterStatus === opt.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* قائمة البطاقات */}
      {filteredApplicants.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center backdrop-blur-xl">
          <UserIcon className="mx-auto h-10 w-10 text-slate-600" />
          <p className="mt-3 text-xs text-slate-400">لم يتم العثور على نتائج مطابقة</p>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2">
          {filteredApplicants.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedApplicant(app)}
              className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-xl transition-all hover:border-indigo-500/40 hover:bg-slate-900 shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-base font-bold text-indigo-400 border border-indigo-500/20">
                    {app.applicant.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                      {app.applicant.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{app.applicant.email}</p>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>

              <div className="mt-3.5 border-t border-slate-800/60 pt-2.5 flex items-center justify-between text-[11px]">
                <div className="min-w-0">
                  <span className="text-slate-500 block text-[9px]">الوظيفة</span>
                  <span className="font-semibold text-indigo-400 truncate block">
                    {app.jobTitle}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-slate-500 block text-[9px]">المرحلة الحالية</span>
                  <span className="font-medium text-slate-300 block">
                    {STEPS[app.currentStep]?.title || "مكتمل"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}