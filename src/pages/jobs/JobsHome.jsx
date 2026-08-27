import { motion } from "framer-motion";
import { BriefcaseIcon, AcademicCapIcon, UserGroupIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useSidebar } from "../../component/common/layout/JobsLayout";

const FEATURES = [
  { icon: AcademicCapIcon, title: "تعليم متميز", desc: "انضم لفريق ي change تعليم للآلاف.", color: "#3b82f6" },
  { icon: UserGroupIcon, title: "فريق متميز", desc: "اعمل مع ناس شغوفة ومحترفة.", color: "#a855f7" },
  { icon: SparklesIcon, title: "نمو مستمر", desc: "تطور مهاراتك وتوسع خبراتك.", color: "#10b981" },
];

const POSITIONS = [
  { title: "مدير تقني", dept: "الهندسة", color: "#3b82f6" },
  { title: "رئيس مسار برمجي", dept: "التعليم", color: "#a855f7" },
  { title: "مراجع أكاديمي", dept: "المحتوى", color: "#06b6d4" },
  { title: "مخطط عمليات", dept: "العمليات", color: "#10b981" },
  { title: "مراجع جودة", dept: "المحتوى", color: "#f59e0b" },
  { title: "المشرف العام", dept: "الإدارة", color: "#ef4444" },
];

export default function JobsHome() {
  const { setActive } = useSidebar();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "var(--accent)", opacity: 0.12 }}
        >
          <AcademicCapIcon className="h-10 w-10" style={{ color: "var(--accent)" }} />
        </div>

        <h1 className="font-display text-4xl font-black" style={{ color: "var(--text-primary)" }}>
          مرحباً بك في <span style={{ color: "var(--accent)" }}>فريق أكاديمي</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          نحن نبحث عن أشخاص متحمسين ل join فريقنا ونساهم معاً في بناء مستقبل التعليم. تحقق من الوظائف المتاحة قدّم الآن.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActive("jobs")}
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <BriefcaseIcon className="h-5 w-5" />
            شاهد الوظائف
          </button>
          <button
            onClick={() => setActive("apply")}
            className="flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            قدّم مباشرة
          </button>
        </div>
      </motion.div>

      {/* Features */}
      <div className="mt-20 grid gap-6 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-2xl border p-6 text-center backdrop-blur-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${f.color}18` }}
            >
              <f.icon className="h-6 w-6" style={{ color: f.color }} />
            </div>
            <h3 className="font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Available Positions */}
      <div className="mt-20">
        <h2 className="text-center font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          الوظائف <span style={{ color: "var(--accent)" }}>المتاحة</span>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POSITIONS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="flex items-center gap-4 rounded-xl border p-4 backdrop-blur-sm transition-all hover:border-[var(--accent)]/30"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{p.title}</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{p.dept}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setActive("apply")}
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <BriefcaseIcon className="h-5 w-5" />
            قدّم الآن
          </button>
        </div>
      </div>
    </div>
  );
}
