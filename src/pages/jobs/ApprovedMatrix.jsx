import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  TableCellsIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { JOBS_LIST, APPLICANTS, INITIAL_MATRIX } from "../../constants/mockMatrix";

export default function ApprovedMatrix() {
  const matrix = INITIAL_MATRIX;

  // 📊 حساب الإحصائيات الإجمالية
  const stats = useMemo(() => {
    let accepted = 0;
    let rejected = 0;
    let pending = 0;
    let totalApplications = 0;

    Object.values(matrix).forEach((row) => {
      Object.values(row).forEach((status) => {
        if (status) {
          totalApplications++;
          if (status === "accepted") accepted++;
          if (status === "rejected") rejected++;
          if (status === "pending") pending++;
        }
      });
    });

    return {
      totalApplicants: APPLICANTS.length,
      totalApplications,
      accepted,
      rejected,
      pending,
    };
  }, [matrix]);

  // 📊 حساب عدد المتقدمين لكل وظيفة على حدة
  const jobApplicantCounts = useMemo(() => {
    const counts = {};
    JOBS_LIST.forEach((job) => {
      counts[job.id] = APPLICANTS.filter(
        (app) => matrix[app.id]?.[job.id] !== undefined
      ).length;
    });
    return counts;
  }, [matrix]);

  // 🎨 رسم شارات الحالة للعرض فقط
  const renderStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <CheckIcon className="h-4 w-4 stroke-[2.5]" />
          </div>
        );
      case "rejected":
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
            <XMarkIcon className="h-4 w-4 stroke-[2.5]" />
          </div>
        );
      case "pending":
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <ClockIcon className="h-4 w-4 stroke-[2]" />
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/40 text-slate-600 border border-slate-800/60 text-xs font-semibold">
            —
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500 selection:text-white" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ═══ Header Section ═══ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md">
              <TableCellsIcon className="h-3.5 w-3.5 text-indigo-400" />
              <span>لوحة العرض التنفيذية</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              مصفوفة <span className="bg-gradient-to-l from-indigo-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">الحالات والموافقات</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-400 max-w-xl leading-relaxed">
              استعراض شامل ودقيق لحالة كل المتقدمين عبر جميع الوظائف.
            </p>
          </div>

          
        </div>

        {/* ═══ KPI Stats Cards ═══ */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="إجمالي المتقدمين"
            value={stats.totalApplicants}
            icon={UserGroupIcon}
            color="indigo"
          />
          <StatCard
            title="المقبولين"
            value={stats.accepted}
            icon={CheckCircleIcon}
            color="emerald"
          />
          <StatCard
            title="المرفوضين"
            value={stats.rejected}
            icon={XCircleIcon}
            color="rose"
          />
          <StatCard
            title="قيد المراجعة"
            value={stats.pending}
            icon={ClockIcon}
            color="amber"
          />
        </div>

        {/* ═══ Matrix Main Table ═══ */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/30 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto max-h-[650px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <table className="w-full border-collapse text-right min-w-[850px]">
              
              {/* Table Header */}
              <thead className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
                <tr>
                  <th className="sticky right-0 z-40 bg-slate-950 px-5 py-4 text-xs font-bold text-slate-400 border-l border-slate-800/80 min-w-[220px]">
                    المتقدم
                  </th>
                  {JOBS_LIST.map((job) => (
                    <th key={job.id} className="px-4 py-4 text-center text-xs font-semibold min-w-[130px]">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: job.color }} />
                          <span className="text-slate-200 font-bold">{job.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {jobApplicantCounts[job.id] || 0} طلبات
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-800/40">
                {APPLICANTS.map((applicant, rowIndex) => (
                  <motion.tr
                    key={applicant.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: rowIndex * 0.02 }}
                    className="group hover:bg-indigo-500/[0.02] transition-colors"
                  >
                    {/* Sticky Applicant Info */}
                    <td className="sticky right-0 z-20 bg-slate-950/90 group-hover:bg-[#0c0f17] backdrop-blur-md px-5 py-3.5 border-l border-slate-800/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 text-xs font-bold text-indigo-300 border border-indigo-500/20 shadow-inner">
                          {applicant.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                            {applicant.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                            {applicant.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Matrix Status Cells */}
                    {JOBS_LIST.map((job) => {
                      const status = matrix[applicant.id]?.[job.id];
                      return (
                        <td key={job.id} className="px-3 py-3 text-center align-middle">
                          <div className="flex justify-center items-center">
                            {renderStatusBadge(status)}
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Legend Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 bg-slate-950/90 px-6 py-4 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">دليل رموز حالات الطلب:</span>
            <div className="flex flex-wrap items-center gap-6">
              <LegendItem color="bg-emerald-500/10 border-emerald-500/30 text-emerald-400" icon={CheckIcon} label="مقبول" />
              <LegendItem color="bg-rose-500/10 border-rose-500/30 text-rose-400" icon={XMarkIcon} label="مرفوض" />
              <LegendItem color="bg-amber-500/10 border-amber-500/30 text-amber-400" icon={ClockIcon} label="قيد المراجعة" />
              <LegendItem color="bg-slate-900 border-slate-800 text-slate-600" label="لم يتقدم" isDash />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// 📌 Reusable KPI Card Component
function StatCard({ title, value, icon: Icon, color }) {
  const colorStyles = {
    indigo: "border-indigo-500/20 bg-indigo-950/10 text-indigo-400",
    emerald: "border-emerald-500/20 bg-emerald-950/10 text-emerald-400",
    rose: "border-rose-500/20 bg-rose-950/10 text-rose-400",
    amber: "border-amber-500/20 bg-amber-950/10 text-amber-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 hover:border-slate-700 ${colorStyles[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${colorStyles[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

// 📌 Reusable Legend Item Component
function LegendItem({ color, icon: Icon, label, isDash }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex h-5 w-5 items-center justify-center rounded-md border ${color}`}>
        {isDash ? <span className="text-[10px] font-bold">—</span> : <Icon className="h-3 w-3 stroke-[2.5]" />}
      </div>
      <span className="text-slate-300 text-[11px] font-medium">{label}</span>
    </div>
  );
}