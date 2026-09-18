import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MOCK_TRACKS } from "../../constants/mockTracks"; // 👈 تأكد من ضبط مسار استيراد MOCK_TRACKS بحسب مشروعك

import {
  PhoneIcon,
  IdentificationIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ArrowLeftIcon,
  SparklesIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";

export default function CandidateProfile() {
  const { id: appId } = useParams();
  const { user, getApplicationById } = useAuth();

  const application = getApplicationById(appId);

  if (!application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white dir-rtl">
        <div className="text-center">
          <h2 className="text-xl font-bold">لم يتم العثور على ملف الطلب</h2>
          <Link to="/my-applications" className="mt-4 inline-block text-xs font-bold text-indigo-400">
            العودة لصفحة طلباتي
          </Link>
        </div>
      </div>
    );
  }
    // 1️⃣ البحث عن الـ Job المطابق
const allJobs = MOCK_TRACKS.flatMap((track) => track.jobs || []);

const matchedJob = 
  allJobs.find((job) => job.id === application.jobId || job.name === application.jobRole) ||
  allJobs.find((job) => job.attachments && job.attachments.length > 0); // 👈 Fallback للمعاينة

// 2️⃣ جلب المرفقات
const attachments =
  application.attachments ||
  application.courseAttachments ||
  matchedJob?.attachments ||
  [];

  // 3️⃣ تحديد اسم الوظيفة/التخصص بأمان
  const jobTitle = application.jobRole || application.jobName || matchedJob?.name || "غير محدد";

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 dir-rtl" dir="rtl">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/my-applications"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            العودة لطلباتي
          </Link>
          <span className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400">
            ملف متقدم موثق 🆔
          </span>
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-right gap-6 border-b border-slate-800/80 pb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-3xl font-black text-white shadow-xl shadow-indigo-500/20 ring-2 ring-white/10">
              {user?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{user?.name || "اسم المتقدم"}</h1>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                المرشح لوظيفة: <span className="text-indigo-300">{jobTitle}</span>
              </p>
              <span className="mt-2 inline-block font-mono text-[11px] font-bold text-slate-500">
                Application ID: {application.id}
              </span>
            </div>
          </div>

          {/* Personal Information Grid */}
          <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
              <EnvelopeIcon className="h-5 w-5 text-indigo-400" />
              <div>
                <span className="block text-[10px] font-bold text-slate-500">البريد الإلكتروني</span>
                <span className="text-xs font-bold text-slate-200">{user?.email || "غير محدد"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
              <PhoneIcon className="h-5 w-5 text-indigo-400" />
              <div>
                <span className="block text-[10px] font-bold text-slate-500">رقم الجوال</span>
                <span className="text-xs font-bold text-slate-200">{user?.phone || "غير مضاف"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 sm:col-span-2">
              <IdentificationIcon className="h-5 w-5 text-indigo-400" />
              <div>
                <span className="block text-[10px] font-bold text-slate-500">رقم الهوية الوطنية / الإقامة</span>
                <span className="text-xs font-bold text-slate-200">{user?.idNumber || "غير مضاف"}</span>
              </div>
            </div>
          </div>

          {/* Final Decision Section */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              نتيجة القرار النهائي
            </h3>
            {application.status === "accepted" ? (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-emerald-300">
                <CheckBadgeIcon className="h-6 w-6 shrink-0 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-400">تم القبول النهائياً 🎉</h4>
                  <p className="mt-1 text-xs text-emerald-200/80">
                    تهانينا! لقد تم اعتماد ملفك الشخصي واجتياز كافة مراحل التقييم بنجاح. سيتم التواصل معك قريباً لتوقيع العقد.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-rose-300">
                <XCircleIcon className="h-6 w-6 shrink-0 text-rose-400" />
                <div>
                  <h4 className="text-sm font-bold text-rose-400">اعتذار عن عدم القبول</h4>
                  <p className="mt-1 text-xs text-rose-200/80">
                    نشكر لك اهتمامك. تم حفظ بياناتك في قاعدة بيانات المتقدمين وسنقرن اسمك بالفرص المستقبلية المناسبة.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 📄 Section: MOCK_TRACKS Attachments */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <DocumentIcon className="h-4 w-4 text-indigo-400" />
                المرفقات والمستندات التعليمية
              </h3>
              <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                {attachments.length} ملف
              </span>
            </div>

            {attachments.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/90 p-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                        {file.type === "presentation" ? (
                          <PresentationChartBarIcon className="h-5 w-5 text-amber-400" />
                        ) : (
                          <DocumentIcon className="h-5 w-5 text-indigo-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">{file.name}</p>
                        <p className="text-[10px] font-medium text-slate-500">{file.size || "PDF File"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {file.url && (
                        <>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                            title="معاينة الملف"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </a>
                          <a
                            href={file.url}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                            title="تحميل"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800/80 p-4 text-center">
                <p className="text-xs text-slate-500">لا توجد مرفقات مرتبطة بهذا المسار/الوظيفة حالياً.</p>
              </div>
            )}
          </div>

          {/* AI Matching Insights */}
          {application.aiAnalysis && (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-indigo-400" />
                <span className="text-xs font-bold text-slate-300">نسبة تطابق الملف مع الوظيفة</span>
              </div>
              <span className="text-sm font-black text-indigo-400">
                {application.aiAnalysis.matchPercentage}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}